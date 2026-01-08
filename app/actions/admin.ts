'use server';

import { createClient, createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Helper to check if user is admin
async function checkIsAdmin() {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    throw new Error('Unauthorized');
  }
  return supabase;
}

// ============ PROJECTS ============

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  location: z.string().min(1, 'Location is required'),
  service_type: z.string().min(1, 'Service type is required'),
  description: z.string().min(1, 'Description is required'),
  featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
});

export async function createProject(formData: FormData) {
  const supabase = await checkIsAdmin();

  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    location: formData.get('location') as string,
    service_type: formData.get('service_type') as string,
    description: formData.get('description') as string,
    featured: formData.get('featured') === 'true',
    is_published: formData.get('is_published') === 'true',
  };

  const result = projectSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { data: project, error } = await supabase
    .from('projects')
    .insert(result.data)
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/portfolio');
  revalidatePath('/');

  return { success: true, projectId: project.id };
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = await checkIsAdmin();

  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    location: formData.get('location') as string,
    service_type: formData.get('service_type') as string,
    description: formData.get('description') as string,
    featured: formData.get('featured') === 'true',
    is_published: formData.get('is_published') === 'true',
  };

  const result = projectSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { error } = await supabase
    .from('projects')
    .update(result.data)
    .eq('id', projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/portfolio');
  revalidatePath(`/portfolio/${data.slug}`);
  revalidatePath('/');

  return { success: true };
}

export async function deleteProject(projectId: string) {
  const supabase = await checkIsAdmin();

  const { error } = await supabase.from('projects').delete().eq('id', projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/portfolio');
  revalidatePath('/');

  return { success: true };
}

export async function uploadProjectImage(
  projectId: string,
  formData: FormData
) {
  await checkIsAdmin();
  const serviceClient = await createServiceClient();

  const file = formData.get('file') as File;
  const caption = formData.get('caption') as string;
  const sortOrder = parseInt(formData.get('sort_order') as string) || 0;

  if (!file || file.size === 0) {
    return { success: false, error: 'No file provided' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${projectId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  // Upload to storage
  const { error: uploadError } = await serviceClient.storage
    .from('portfolio')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  // Create database record
  const { error: insertError } = await serviceClient
    .from('project_images')
    .insert({
      project_id: projectId,
      storage_path: fileName,
      caption: caption || null,
      sort_order: sortOrder,
    });

  if (insertError) {
    // Clean up uploaded file
    await serviceClient.storage.from('portfolio').remove([fileName]);
    return { success: false, error: insertError.message };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/portfolio');

  return { success: true };
}

export async function deleteProjectImage(imageId: string, storagePath: string) {
  await checkIsAdmin();
  const serviceClient = await createServiceClient();

  // Delete from storage
  await serviceClient.storage.from('portfolio').remove([storagePath]);

  // Delete from database
  const { error } = await serviceClient
    .from('project_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/portfolio');

  return { success: true };
}

// ============ REVIEWS ============

const reviewSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rating: z.number().min(1).max(5),
  text: z.string().min(1, 'Review text is required'),
  source: z.string().optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
});

export async function createReview(formData: FormData) {
  const supabase = await checkIsAdmin();

  const data = {
    name: formData.get('name') as string,
    rating: parseInt(formData.get('rating') as string) || 5,
    text: formData.get('text') as string,
    source: (formData.get('source') as string) || undefined,
    is_featured: formData.get('is_featured') === 'true',
    is_published: formData.get('is_published') === 'true',
  };

  const result = reviewSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { error } = await supabase.from('reviews').insert(result.data);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/reviews');
  revalidatePath('/');

  return { success: true };
}

export async function updateReview(reviewId: string, formData: FormData) {
  const supabase = await checkIsAdmin();

  const data = {
    name: formData.get('name') as string,
    rating: parseInt(formData.get('rating') as string) || 5,
    text: formData.get('text') as string,
    source: (formData.get('source') as string) || null,
    is_featured: formData.get('is_featured') === 'true',
    is_published: formData.get('is_published') === 'true',
  };

  const result = reviewSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { error } = await supabase
    .from('reviews')
    .update(result.data)
    .eq('id', reviewId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/reviews');
  revalidatePath('/');

  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const supabase = await checkIsAdmin();

  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/reviews');
  revalidatePath('/');

  return { success: true };
}

// ============ QUOTES ============

export async function updateQuoteStatus(
  quoteId: string,
  status: string,
  notes?: string
) {
  const supabase = await checkIsAdmin();

  const updateData: { status: string; notes?: string } = { status };
  if (notes !== undefined) {
    updateData.notes = notes;
  }

  const { error } = await supabase
    .from('quote_requests')
    .update(updateData)
    .eq('id', quoteId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/quotes');

  return { success: true };
}

export async function deleteQuote(quoteId: string) {
  const supabase = await checkIsAdmin();

  const { error } = await supabase
    .from('quote_requests')
    .delete()
    .eq('id', quoteId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/quotes');

  return { success: true };
}

// ============ SETTINGS ============

const settingsSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Valid email is required'),
  service_area: z.string().min(1, 'Service area is required'),
  hero_headline: z.string().min(1, 'Hero headline is required'),
  hero_subheadline: z.string().min(1, 'Hero subheadline is required'),
});

export async function updateSiteSettings(formData: FormData) {
  const supabase = await checkIsAdmin();

  const data = {
    business_name: formData.get('business_name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    service_area: formData.get('service_area') as string,
    hero_headline: formData.get('hero_headline') as string,
    hero_subheadline: formData.get('hero_subheadline') as string,
  };

  const result = settingsSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const { error } = await supabase
    .from('site_settings')
    .update(result.data)
    .eq('id', 1);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/contact');

  return { success: true };
}
