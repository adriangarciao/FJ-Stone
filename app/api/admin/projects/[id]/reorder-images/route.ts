import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reorderImagesSchema } from '@/lib/validations/portfolio';
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

    // Parse and validate request body
    const body = await request.json();
    const parseResult = reorderImagesSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { orderedImageIds } = parseResult.data;

    // Verify all images belong to this project
    const { data: projectImages, error: fetchError } = await supabase
      .from('project_images')
      .select('id')
      .eq('project_id', projectId);

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to verify images' },
        { status: 500 }
      );
    }

    const projectImageIds = new Set(projectImages?.map((img) => img.id) || []);
    const invalidIds = orderedImageIds.filter((id) => !projectImageIds.has(id));

    if (invalidIds.length > 0) {
      return NextResponse.json(
        { error: 'Some image IDs do not belong to this project' },
        { status: 400 }
      );
    }

    // Update sort_order for each image
    const updatePromises = orderedImageIds.map((imageId, index) =>
      supabase
        .from('project_images')
        .update({ sort_order: index })
        .eq('id', imageId)
    );

    const results = await Promise.all(updatePromises);
    const errors = results.filter((r) => r.error);

    if (errors.length > 0) {
      console.error('Errors updating sort order:', errors);
      return NextResponse.json(
        { error: 'Failed to update some image orders' },
        { status: 500 }
      );
    }

    // Get project slug for revalidation
    const { data: project } = await supabase
      .from('projects')
      .select('slug')
      .eq('id', projectId)
      .single();

    // Revalidate pages
    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');
    if (project?.slug) {
      revalidatePath(`/portfolio/${project.slug}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in reorder images route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
