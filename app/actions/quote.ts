'use server';

import { createClient, createServiceClient } from '@/lib/supabase/server';
import { quoteRequestSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export interface QuoteSubmissionResult {
  success: boolean;
  error?: string;
  quoteId?: string;
}

export async function submitQuoteRequest(
  formData: FormData
): Promise<QuoteSubmissionResult> {
  try {
    // Extract form fields
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: (formData.get('email') as string) || undefined,
      service_type: formData.get('service_type') as string,
      location: (formData.get('location') as string) || undefined,
      description: formData.get('description') as string,
    };

    // Validate with Zod
    const result = quoteRequestSchema.safeParse(data);
    if (!result.success) {
      const firstError = result.error.issues[0];
      return {
        success: false,
        error: firstError?.message || 'Validation failed',
      };
    }

    // Insert quote request using anon client (RLS allows public insert)
    const supabase = await createClient();
    const { data: quote, error: insertError } = await supabase
      .from('quote_requests')
      .insert({
        name: result.data.name,
        phone: result.data.phone,
        email: result.data.email || null,
        service_type: result.data.service_type,
        location: result.data.location || null,
        description: result.data.description,
        status: 'NEW',
      })
      .select('id')
      .single();

    if (insertError || !quote) {
      console.error('Error inserting quote request:', insertError);
      return {
        success: false,
        error: 'Failed to submit quote request. Please try again.',
      };
    }

    // Handle file uploads if present
    const files = formData.getAll('files') as File[];
    if (files.length > 0 && files[0].size > 0) {
      // Use service role client for storage upload (private bucket)
      const serviceClient = await createServiceClient();

      for (const file of files) {
        if (file.size === 0) continue;
        if (file.size > 10 * 1024 * 1024) continue; // Skip files > 10MB

        const fileExt = file.name.split('.').pop();
        const fileName = `${quote.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to quote-uploads bucket
        const { error: uploadError } = await serviceClient.storage
          .from('quote-uploads')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          continue;
        }

        // Insert file record
        await serviceClient.from('quote_request_files').insert({
          quote_request_id: quote.id,
          storage_path: fileName,
          file_name: file.name,
        });
      }
    }

    return {
      success: true,
      quoteId: quote.id,
    };
  } catch (error) {
    console.error('Quote submission error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
