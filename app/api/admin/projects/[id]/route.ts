import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { updateProjectSchema } from '@/lib/validations/portfolio';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH - Update project
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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

    // Parse and validate request body
    const body = await request.json();
    const parseResult = updateProjectSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Use service client to bypass RLS for operations
    const serviceClient = await createServiceClient();

    // If slug is being changed, check uniqueness (use service client to see all)
    if (data.slug) {
      const { data: existingProject } = await serviceClient
        .from('projects')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', projectId)
        .single();

      if (existingProject) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Build update object (only include defined fields)
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.service_type !== undefined) updateData.service_type = data.service_type;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.is_published !== undefined) updateData.is_published = data.is_published;

    // Update project (use service client to bypass RLS)
    const { data: project, error: updateError } = await serviceClient
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating project:', updateError);
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      );
    }

    // Revalidate pages
    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${project.slug}`);
    revalidatePath('/');

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error in update project route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Use service client to bypass RLS
    const serviceClient = await createServiceClient();

    // Get the project slug for path revalidation
    const { data: project } = await serviceClient
      .from('projects')
      .select('slug')
      .eq('id', projectId)
      .single();

    // Get all project images for storage cleanup
    const { data: images } = await serviceClient
      .from('project_images')
      .select('storage_path')
      .eq('project_id', projectId);

    // Delete images from storage
    if (images && images.length > 0) {
      const storagePaths = images
        .map((img) => img.storage_path)
        .filter((path) => path && !path.startsWith('/images/')); // Skip local images

      if (storagePaths.length > 0) {
        await serviceClient.storage.from('portfolio').remove(storagePaths);
      }
    }

    // Delete project (cascade should delete project_images due to FK)
    const { error: deleteError } = await serviceClient
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (deleteError) {
      console.error('Error deleting project:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      );
    }

    // Revalidate pages
    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');
    if (project?.slug) {
      revalidatePath(`/portfolio/${project.slug}`);
    }
    revalidatePath('/');

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in delete project route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get single project with images (for admin preview)
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // Use service client to bypass RLS for admin access
    const serviceClient = await createServiceClient();

    // Get project
    const { data: project, error: projectError } = await serviceClient
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get project images
    const { data: images } = await serviceClient
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    return NextResponse.json({
      project: {
        ...project,
        images: images || [],
      },
    });
  } catch (error) {
    console.error('Error in get project route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
