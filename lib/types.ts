export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  service_type: string;
  description: string;
  featured: boolean;
  is_published: boolean;
  created_at: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service_type: string;
  location: string | null;
  description: string;
  status: 'NEW' | 'CONTACTED' | 'SCHEDULED' | 'WON' | 'LOST';
  notes: string | null;
  created_at: string;
  files?: QuoteRequestFile[];
}

export interface QuoteRequestFile {
  id: string;
  quote_request_id: string;
  storage_path: string;
  file_name: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  business_name: string;
  phone: string;
  email: string;
  service_area: string;
  hero_headline: string;
  hero_subheadline: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface AdminAllowlist {
  id: string;
  email: string;
  created_at: string;
}

// Database types for Supabase
export type Database = {
  public: {
    Tables: {
      admin_allowlist: {
        Row: AdminAllowlist;
        Insert: Omit<AdminAllowlist, 'id' | 'created_at'>;
        Update: Partial<Omit<AdminAllowlist, 'id' | 'created_at'>>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, 'updated_at'>;
        Update: Partial<Omit<SiteSettings, 'id' | 'updated_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'images'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'images'>>;
      };
      project_images: {
        Row: ProjectImage;
        Insert: Omit<ProjectImage, 'id' | 'created_at'>;
        Update: Partial<Omit<ProjectImage, 'id' | 'created_at'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'>;
        Update: Partial<Omit<Review, 'id' | 'created_at'>>;
      };
      quote_requests: {
        Row: QuoteRequest;
        Insert: Omit<QuoteRequest, 'id' | 'created_at' | 'files'>;
        Update: Partial<Omit<QuoteRequest, 'id' | 'created_at' | 'files'>>;
      };
      quote_request_files: {
        Row: QuoteRequestFile;
        Insert: Omit<QuoteRequestFile, 'id' | 'created_at'>;
        Update: Partial<Omit<QuoteRequestFile, 'id' | 'created_at'>>;
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
};
