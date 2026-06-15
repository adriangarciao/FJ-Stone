import 'server-only';
import { createClient } from './server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import type { Project, Review, SiteSettings } from '../types';
import { portfolioProjects, getFeaturedPortfolioProjects } from '@/src/data/portfolioImages';
import { addBlurToProjects } from '../getImagePlaceholder';

// Default site settings fallback
const defaultSiteSettings: SiteSettings = {
  id: 1,
  business_name: "F&J's Stone Services",
  phone: '(847) 847-9376',
  email: 'fjstoneservices@gmail.com',
  service_area: 'Greater Chicago Area',
  hero_headline: 'Crafting Outdoor Spaces That Last',
  hero_subheadline: 'Expert hardscaping, patios, and stonework for residential and commercial properties. Quality craftsmanship built to withstand the test of time.',
  updated_at: new Date().toISOString(),
};

// Uses a cookie-free client so this can safely run inside unstable_cache
// (the SSR createClient requires request context via cookies())
const getCachedSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error || !data) {
      console.error('Error fetching site settings:', error);
      return defaultSiteSettings;
    }

    return data as SiteSettings;
  },
  ['site-settings'],
  { revalidate: 3600, tags: ['site-settings'] },
);

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await getCachedSiteSettings();
  } catch {
    return defaultSiteSettings;
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error || !projects || projects.length === 0) {
      // Fallback to local portfolio data
      console.log('Using local portfolio data');
      return addBlurToProjects(portfolioProjects);
    }

    // Fetch images for each project (blur_data_url comes from DB automatically via select('*'))
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const { data: images } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', project.id)
          .order('sort_order', { ascending: true });

        return {
          ...project,
          images: images || [],
        } as Project;
      })
    );

    return projectsWithImages;
  } catch {
    // Fallback to local portfolio data — blur must be generated since it's not in DB
    return addBlurToProjects(portfolioProjects);
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !projects || projects.length === 0) {
      // Fallback to local portfolio data
      return addBlurToProjects(getFeaturedPortfolioProjects());
    }

    // Fetch the cover image for every project in a single query (avoids N+1),
    // then keep the first image per project by sort_order.
    const projectIds = projects.map((p) => p.id);
    const { data: allImages } = await supabase
      .from('project_images')
      .select('*')
      .in('project_id', projectIds)
      .order('sort_order', { ascending: true });

    const coverByProject = new Map<string, NonNullable<typeof allImages>[number]>();
    for (const image of allImages || []) {
      if (!coverByProject.has(image.project_id)) {
        coverByProject.set(image.project_id, image);
      }
    }

    const projectsWithImages = projects.map((project) => {
      const cover = coverByProject.get(project.id);
      return {
        ...project,
        images: cover ? [cover] : [],
      } as Project;
    });

    return projectsWithImages;
  } catch {
    // Fallback to local portfolio data — blur must be generated since it's not in DB
    return addBlurToProjects(getFeaturedPortfolioProjects());
  }
}

export async function getProjectBySlug(slug: string, includeUnpublished = false): Promise<Project | null> {
  try {
    const supabase = await createClient();

    // Build query - if includeUnpublished, check admin status first
    let query = supabase.from('projects').select('*').eq('slug', slug);

    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }

    const { data: project, error } = await query.single();

    if (error || !project) {
      // Fallback to local portfolio data (only for published)
      if (!includeUnpublished) {
        const localProject = portfolioProjects.find(p => p.slug === slug);
        return localProject || null;
      }
      return null;
    }

    // Fetch images for the project
    const { data: images } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', project.id)
      .order('sort_order', { ascending: true });

    return {
      ...project,
      images: images || [],
    } as Project;
  } catch {
    // Fallback to local portfolio data
    const localProject = portfolioProjects.find(p => p.slug === slug);
    return localProject || null;
  }
}

// Get all projects (including unpublished) - admin only
export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !projects) {
      return [];
    }

    // Fetch images for each project
    const projectsWithImages = await Promise.all(
      projects.map(async (project) => {
        const { data: images } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', project.id)
          .order('sort_order', { ascending: true });

        return {
          ...project,
          images: images || [],
        } as Project;
      })
    );

    return projectsWithImages;
  } catch {
    return [];
  }
}

export async function getPublishedReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data as Review[];
  } catch {
    return [];
  }
}

export async function getFeaturedReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error || !data) {
      console.error('Error fetching featured reviews:', error);
      return [];
    }

    return data as Review[];
  } catch {
    return [];
  }
}
