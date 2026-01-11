-- =====================================================
-- FJ Stone & Hardscaping - Supabase Setup Script
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create admin_allowlist table
CREATE TABLE IF NOT EXISTS public.admin_allowlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Create is_admin() function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_allowlist
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$$;

-- 3. Create site_settings table (single row)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name text NOT NULL DEFAULT 'F&J''s Stone Services',
  phone text NOT NULL DEFAULT '(847) 847-9376',
  email text NOT NULL DEFAULT 'fjstoneservices@gmail.com',
  service_area text NOT NULL DEFAULT 'Greater Chicago Area',
  hero_headline text NOT NULL DEFAULT 'Crafting Outdoor Spaces That Last',
  hero_subheadline text NOT NULL DEFAULT 'Expert hardscaping, patios, and stonework for residential and commercial properties.',
  updated_at timestamptz DEFAULT now()
);

-- 4. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  location text NOT NULL,
  service_type text NOT NULL,
  description text NOT NULL,
  featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 5. Create project_images table
CREATE TABLE IF NOT EXISTS public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  caption text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 6. Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  source text,
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 7. Create quote_requests table
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  service_type text NOT NULL,
  location text,
  description text NOT NULL,
  preferred_contact text,
  status text DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'SCHEDULED', 'WON', 'LOST')),
  notes text,
  source_ip text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- 8. Create quote_request_files table
CREATE TABLE IF NOT EXISTS public.quote_request_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_request_id uuid REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  original_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz DEFAULT now()
);

-- Migration for existing tables (run if tables already exist):
-- ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS preferred_contact text;
-- ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS source_ip text;
-- ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS user_agent text;
-- ALTER TABLE public.quote_request_files RENAME COLUMN file_name TO original_name;
-- ALTER TABLE public.quote_request_files ADD COLUMN IF NOT EXISTS mime_type text;
-- ALTER TABLE public.quote_request_files ADD COLUMN IF NOT EXISTS size_bytes bigint;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_request_files ENABLE ROW LEVEL SECURITY;

-- admin_allowlist: only admin can read
CREATE POLICY "Admin can read allowlist" ON public.admin_allowlist
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- site_settings: public can read, admin can update
CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- projects: public can read published, admin can CRUD
CREATE POLICY "Public can read published projects" ON public.projects
  FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin can insert projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete projects" ON public.projects
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- project_images: public can read for published projects, admin can CRUD
CREATE POLICY "Public can read images of published projects" ON public.project_images
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_images.project_id
      AND (projects.is_published = true OR public.is_admin())
    )
  );

CREATE POLICY "Admin can insert project images" ON public.project_images
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update project images" ON public.project_images
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete project images" ON public.project_images
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- reviews: public can read published, admin can CRUD
CREATE POLICY "Public can read published reviews" ON public.reviews
  FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin can insert reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update reviews" ON public.reviews
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete reviews" ON public.reviews
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- quote_requests: public can insert only, admin can read/update
CREATE POLICY "Public can submit quote requests" ON public.quote_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can read quote requests" ON public.quote_requests
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can update quote requests" ON public.quote_requests
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete quote requests" ON public.quote_requests
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- quote_request_files: admin only (files uploaded via server action)
CREATE POLICY "Admin can read quote files" ON public.quote_request_files
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can insert quote files" ON public.quote_request_files
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Service role can insert quote files" ON public.quote_request_files
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Admin can delete quote files" ON public.quote_request_files
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- =====================================================
-- STORAGE BUCKETS
-- Run these in Supabase Dashboard > Storage or via SQL
-- =====================================================

-- Create portfolio bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Create quote-uploads bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-uploads', 'quote-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for portfolio bucket
CREATE POLICY "Public can read portfolio images"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'portfolio');

CREATE POLICY "Admin can upload portfolio images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());

CREATE POLICY "Admin can update portfolio images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio' AND public.is_admin());

CREATE POLICY "Admin can delete portfolio images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio' AND public.is_admin());

-- Storage policies for quote-uploads bucket (private, service role for uploads)
CREATE POLICY "Admin can read quote uploads"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'quote-uploads' AND public.is_admin());

CREATE POLICY "Service role can upload quote files"
ON storage.objects FOR INSERT TO service_role
WITH CHECK (bucket_id = 'quote-uploads');

CREATE POLICY "Admin can delete quote uploads"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'quote-uploads' AND public.is_admin());

-- =====================================================
-- SEED DATA (Optional - run after tables created)
-- =====================================================

-- Insert default site_settings row
INSERT INTO public.site_settings (id, business_name, phone, email, service_area, hero_headline, hero_subheadline)
VALUES (
  1,
  'FJ Stone & Hardscaping',
  '(555) 123-4567',
  'info@fjstone.com',
  'Greater Metro Area',
  'Crafting Outdoor Spaces That Last',
  'Expert hardscaping, patios, and stonework for residential and commercial properties. Quality craftsmanship built to withstand the test of time.'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ADMIN USER SETUP
-- Replace with your actual admin email
-- =====================================================

-- INSERT INTO public.admin_allowlist (email)
-- VALUES ('your-admin-email@example.com');

-- =====================================================
-- INDEXES for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_sort_order ON public.project_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_reviews_is_published ON public.reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_reviews_is_featured ON public.reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON public.quote_requests(created_at DESC);
