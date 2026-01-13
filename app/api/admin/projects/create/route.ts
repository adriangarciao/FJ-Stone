import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { createProjectSchema, generateSlug } from '@/lib/validations/portfolio';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
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
    const parseResult = createProjectSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Use service client to bypass RLS for slug check and insert
    const serviceClient = await createServiceClient();

    // Generate slug from title
    let slug = generateSlug(data.title);

    // Ensure slug is unique (use service client to see all projects including unpublished)
    const { data: existingProject } = await serviceClient
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingProject) {
      // Append timestamp to make unique
      slug = `${slug}-${Date.now()}`;
    }

    // Insert project (use service client to bypass RLS)
    const { data: project, error: insertError } = await serviceClient
      .from('projects')
      .insert({
        title: data.title,
        slug,
        service_type: data.service_type,
        description: data.description,
        location: data.location || '',
        featured: data.featured ?? false,
        is_published: data.is_published ?? false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating project:', insertError);
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      );
    }

    // Revalidate pages
    revalidatePath('/admin/projects');
    revalidatePath('/portfolio');
    revalidatePath('/');

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error in create project route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
