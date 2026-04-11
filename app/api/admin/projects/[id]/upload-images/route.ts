import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import {
  validatePortfolioFiles,
  generateSafeFileName,
  validateFileMagicBytes,
} from '@/lib/validations/portfolio';
import { generateBlurDataUrl } from '@/lib/getImagePlaceholder';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params;
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is admin
    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, slug')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get current image count
    const { count: existingCount } = await supabase
      .from('project_images')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    // Parse multipart form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Validate files
    const validationResult = validatePortfolioFiles(files, existingCount || 0);
    if (!validationResult.valid) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 });
    }

    // Use service client for storage operations
    const serviceClient = await createServiceClient();

    // Get current max sort_order
    const { data: maxSortResult } = await supabase
      .from('project_images')
      .select('sort_order')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();

    let nextSortOrder = (maxSortResult?.sort_order ?? -1) + 1;

    // Upload files and create records
    const uploadedImages = [];
    const errors = [];

    for (const file of files) {
      try {
        // Convert file to buffer for upload
        const arrayBuffer = await file.arrayBuffer();

        // SECURITY: Validate magic bytes to prevent MIME type spoofing
        const magicValidation = await validateFileMagicBytes(arrayBuffer, file.type);
        if (!magicValidation.valid) {
          errors.push(`${file.name}: ${magicValidation.error}`);
          continue;
        }

        // Generate safe storage path
        const storagePath = generateSafeFileName(projectId, file.name);
        const buffer = Buffer.from(arrayBuffer);

        // Generate blur placeholder while buffer is in memory (free — no extra fetch)
        const blur_data_url = await generateBlurDataUrl(buffer);

        // Upload to storage
        const { error: uploadError } = await serviceClient.storage
          .from('portfolio')
          .upload(storagePath, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          errors.push(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        // Create database record with blur placeholder
        const { data: imageRecord, error: insertError } = await serviceClient
          .from('project_images')
          .insert({
            project_id: projectId,
            storage_path: storagePath,
            caption: null,
            alt: null,
            sort_order: nextSortOrder++,
            blur_data_url,
          })
          .select()
          .single();

        if (insertError) {
          // Clean up uploaded file
          await serviceClient.storage.from('portfolio').remove([storagePath]);
          errors.push(`Failed to save ${file.name}: ${insertError.message}`);
          continue;
        }

        uploadedImages.push(imageRecord);
      } catch (err) {
        errors.push(`Error processing ${file.name}`);
        console.error('Error processing file:', err);
      }
    }

    // Revalidate pages
    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${project.slug}`);

    if (errors.length > 0 && uploadedImages.length === 0) {
      return NextResponse.json(
        { error: errors.join('; ') },
        { status: 500 }
      );
    }

    return NextResponse.json({
      images: uploadedImages,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error in upload images route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
