'use server';

import { headers } from 'next/headers';
import { createServiceClient } from '@/lib/supabase/server';
import { quoteRequestSchema, validateFiles, FILE_CONSTRAINTS } from '@/lib/validations';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { sendQuoteNotificationEmail, type PhotoLink } from '@/lib/email';

export interface QuoteSubmissionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  requestId?: string;
}

// Rate limit config: 5 requests per minute per IP
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
};

// Signed URL expiration: 24 hours in seconds
const SIGNED_URL_EXPIRY_SECONDS = 86400;

interface UploadedFile {
  storagePath: string;
  originalName: string;
}

export async function submitQuoteRequest(
  formData: FormData
): Promise<QuoteSubmissionResult> {
  try {
    const headersList = await headers();
    const clientIP = getClientIP(headersList);
    const userAgent = headersList.get('user-agent') || undefined;

    // 1. Rate limiting check
    const rateLimitResult = checkRateLimit(clientIP, RATE_LIMIT_CONFIG);
    if (!rateLimitResult.success) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return {
        success: false,
        error: 'Too many requests. Please wait a moment and try again.',
      };
    }

    // 2. Honeypot check - if the hidden field is filled, it's likely a bot
    const honeypot = formData.get('company_website') as string;
    if (honeypot && honeypot.trim() !== '') {
      console.warn(`Honeypot triggered from IP: ${clientIP}`);
      // Return success to not tip off the bot, but don't process
      return {
        success: true,
        requestId: 'blocked',
      };
    }

    // 3. Extract and validate form fields
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      service_type: formData.get('service_type') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      preferred_contact: (formData.get('preferred_contact') as string) || undefined,
    };

    // Server-side validation with Zod
    const result = quoteRequestSchema.safeParse(data);
    if (!result.success) {
      // Build field-specific error map
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && typeof field === 'string' && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      const firstError = result.error.issues[0];
      return {
        success: false,
        error: firstError?.message || 'Please check the form for errors',
        fieldErrors,
      };
    }

    // 4. Validate files
    const files = formData.getAll('files') as File[];
    const validFiles = files.filter((f) => f.size > 0);

    if (validFiles.length > 0) {
      const fileValidation = validateFiles(validFiles);
      if (!fileValidation.valid) {
        return {
          success: false,
          error: fileValidation.error,
        };
      }
    }

    // 5. Insert quote request using service client (bypasses RLS)
    // We use service role here because the anon client with cookies
    // can pick up authenticated sessions that don't have insert permissions
    const supabase = await createServiceClient();

    // Build insert object with only core fields first
    // New columns (source_ip, user_agent, preferred_contact) are optional
    // Run the migration in supabase/setup.sql to enable them
    const insertData: Record<string, unknown> = {
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email || null,
      service_type: result.data.service_type,
      location: result.data.location || null,
      description: result.data.description,
      status: 'NEW',
    };

    // Try to include optional columns (will be ignored if they don't exist in DB)
    // These require running the migration first
    if (result.data.preferred_contact) {
      insertData.preferred_contact = result.data.preferred_contact;
    }
    if (clientIP !== 'unknown') {
      insertData.source_ip = clientIP;
    }
    if (userAgent) {
      insertData.user_agent = userAgent.slice(0, 500);
    }

    const { data: quote, error: insertError } = await supabase
      .from('quote_requests')
      .insert(insertData)
      .select('id')
      .single();

    if (insertError || !quote) {
      console.error('Error inserting quote request:', insertError);
      return {
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }

    // 6. Handle file uploads if present
    const uploadedFiles: UploadedFile[] = [];

    if (validFiles.length > 0) {
      for (const file of validFiles) {
        // Double-check file constraints on server
        if (file.size > FILE_CONSTRAINTS.maxSizeBytes) {
          console.warn(`File too large: ${file.name} (${file.size} bytes)`);
          continue;
        }

        if (!FILE_CONSTRAINTS.allowedTypes.includes(file.type as (typeof FILE_CONSTRAINTS.allowedTypes)[number])) {
          console.warn(`Invalid file type: ${file.name} (${file.type})`);
          continue;
        }

        // Generate secure filename
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt) ? fileExt : 'jpg';
        const storagePath = `${quote.id}/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${safeExt}`;

        // Upload to quote-uploads bucket (using the same service client)
        const { error: uploadError } = await supabase.storage
          .from('quote-uploads')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          console.error('Error uploading file to storage:', uploadError);
          continue;
        }

        // Insert file record into database
        const { error: fileRecordError } = await supabase
          .from('quote_request_files')
          .insert({
            quote_request_id: quote.id,
            storage_path: storagePath,
            mime_type: file.type,
            size_bytes: file.size,
          });

        if (fileRecordError) {
          // Log but don't fail - file is already in storage
          console.warn('Could not insert file record:', fileRecordError.message);
        }

        // Track uploaded file for signed URL generation
        uploadedFiles.push({
          storagePath,
          originalName: file.name,
        });
      }
    }

    // 7. Generate signed URLs for uploaded photos
    const photoLinks: PhotoLink[] = [];

    for (const uploadedFile of uploadedFiles) {
      try {
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('quote-uploads')
          .createSignedUrl(uploadedFile.storagePath, SIGNED_URL_EXPIRY_SECONDS);

        if (signedUrlError || !signedUrlData?.signedUrl) {
          console.error('Error generating signed URL:', signedUrlError);
          photoLinks.push({
            name: uploadedFile.originalName,
            url: null,
          });
        } else {
          photoLinks.push({
            name: uploadedFile.originalName,
            url: signedUrlData.signedUrl,
          });
        }
      } catch (err) {
        console.error('Failed to generate signed URL:', err);
        photoLinks.push({
          name: uploadedFile.originalName,
          url: null,
        });
      }
    }

    // 8. Send email notification (non-blocking - don't fail submission if email fails)
    const emailResult = await sendQuoteNotificationEmail({
      requestId: quote.id,
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      serviceType: result.data.service_type,
      location: result.data.location,
      description: result.data.description,
      preferredContact: result.data.preferred_contact,
      fileCount: uploadedFiles.length,
      submittedAt: new Date(),
      photoLinks: photoLinks.length > 0 ? photoLinks : undefined,
    });

    if (!emailResult.success) {
      console.error('Failed to send quote notification email:', emailResult.error);
      // Don't fail the submission - the quote is saved, we can still see it in admin
    }

    return {
      success: true,
      requestId: quote.id,
    };
  } catch (error) {
    console.error('Quote submission error:', error);
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    };
  }
}
