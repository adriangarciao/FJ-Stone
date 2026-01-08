import { createClient } from './server';
import type { Project, Review, QuoteRequest, SiteSettings } from '../types';

export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !projects) {
      console.error('Error fetching projects:', error);
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

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const supabase = await createClient();
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !project) {
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
    return null;
  }
}

export async function getAllReviews(): Promise<Review[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
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

export async function getReviewById(id: string): Promise<Review | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Review;
  } catch {
    return null;
  }
}

export async function getAllQuoteRequests(): Promise<QuoteRequest[]> {
  try {
    const supabase = await createClient();
    const { data: quotes, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !quotes) {
      console.error('Error fetching quote requests:', error);
      return [];
    }

    // Fetch files for each quote
    const quotesWithFiles = await Promise.all(
      quotes.map(async (quote) => {
        const { data: files } = await supabase
          .from('quote_request_files')
          .select('*')
          .eq('quote_request_id', quote.id);

        return {
          ...quote,
          files: files || [],
        } as QuoteRequest;
      })
    );

    return quotesWithFiles;
  } catch {
    return [];
  }
}

export async function getQuoteById(id: string): Promise<QuoteRequest | null> {
  try {
    const supabase = await createClient();
    const { data: quote, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !quote) {
      return null;
    }

    // Fetch files
    const { data: files } = await supabase
      .from('quote_request_files')
      .select('*')
      .eq('quote_request_id', quote.id);

    return {
      ...quote,
      files: files || [],
    } as QuoteRequest;
  } catch {
    return null;
  }
}

export async function getAdminSiteSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error || !data) {
      console.error('Error fetching site settings:', error);
      return null;
    }

    return data as SiteSettings;
  } catch {
    return null;
  }
}
