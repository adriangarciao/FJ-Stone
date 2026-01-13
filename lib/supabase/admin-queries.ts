import { createClient, createServiceClient } from './server';
import type { Project, Review, QuoteRequest, SiteSettings, QuoteRequestFile } from '../types';

// Signed URL expiration: 1 hour in seconds
const SIGNED_URL_EXPIRY_SECONDS = 3600;

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

/**
 * Generate signed URLs for quote request files.
 * Uses service client to access the private quote-uploads bucket.
 * Returns a map of file ID to signed URL.
 */
export async function getQuoteFileSignedUrls(
  files: QuoteRequestFile[]
): Promise<Record<string, string | null>> {
  if (!files || files.length === 0) {
    return {};
  }

  try {
    const supabase = await createServiceClient();
    const urlMap: Record<string, string | null> = {};

    for (const file of files) {
      try {
        const { data, error } = await supabase.storage
          .from('quote-uploads')
          .createSignedUrl(file.storage_path, SIGNED_URL_EXPIRY_SECONDS);

        if (error || !data?.signedUrl) {
          console.error(`Error generating signed URL for ${file.id}:`, error);
          urlMap[file.id] = null;
        } else {
          urlMap[file.id] = data.signedUrl;
        }
      } catch (err) {
        console.error(`Failed to generate signed URL for ${file.id}:`, err);
        urlMap[file.id] = null;
      }
    }

    return urlMap;
  } catch {
    return {};
  }
}
