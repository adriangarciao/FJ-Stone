import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { updateImageSchema } from '@/lib/validations/portfolio';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: Promise<{ imageId: string }>;
}

// PATCH - Update image caption/alt/sort_order
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { imageId } = await params;
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

    // Parse and validate request body
    const body = await request.json();
    const parseResult = updateImageSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Build update object (only include defined fields)
    const updateData: Record<string, unknown> = {};
    if (data.caption !== undefined) updateData.caption = data.caption;
    if (data.alt !== undefined) updateData.alt = data.alt;
    if (data.sort_order !== undefined) updateData.sort_order = data.sort_order;

    // Update image
    const { data: image, error: updateError } = await supabase
      .from('project_images')
      .update(updateData)
      .eq('id', imageId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating image:', updateError);
      return NextResponse.json(
        { error: 'Failed to update image' },
        { status: 500 }
      );
    }

    // Get project slug for revalidation
    const { data: project } = await supabase
      .from('projects')
      .select('slug')
      .eq('id', image.project_id)
      .single();

    // Revalidate pages
    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');
    if (project?.slug) {
      revalidatePath(`/portfolio/${project.slug}`);
    }

    const imageWithoutProjects = image;

    return NextResponse.json({ image: imageWithoutProjects });
  } catch (error) {
    console.error('Error in update image route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete image
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { imageId } = await params;
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

    // Get image info for storage cleanup and revalidation
    const { data: image, error: fetchError } = await supabase
      .from('project_images')
      .select('storage_path, project_id')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Get project slug for revalidation
    const { data: project } = await supabase
      .from('projects')
      .select('slug')
      .eq('id', image.project_id)
      .single();

    // Use service client for storage operations
    const serviceClient = await createServiceClient();

    // Delete from storage (skip local images)
    if (image.storage_path && !image.storage_path.startsWith('/images/')) {
      await serviceClient.storage.from('portfolio').remove([image.storage_path]);
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from('project_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Error deleting image:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }

    // Normalize sort_order for remaining images
    const { data: remainingImages } = await supabase
      .from('project_images')
      .select('id')
      .eq('project_id', image.project_id)
      .order('sort_order', { ascending: true });

    if (remainingImages && remainingImages.length > 0) {
      const updatePromises = remainingImages.map((img, index) =>
        supabase
          .from('project_images')
          .update({ sort_order: index })
          .eq('id', img.id)
      );
      await Promise.all(updatePromises);
    }

    // Revalidate pages
    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');
    if (project?.slug) {
      revalidatePath(`/portfolio/${project.slug}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in delete image route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
