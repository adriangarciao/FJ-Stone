-- =====================================================
-- Portfolio Visual Editor - RLS Policies
-- =====================================================
-- This migration sets up Row Level Security for the
-- projects, project_images tables and portfolio storage bucket.
--
-- Admin is determined via the is_admin() function which
-- checks the admin_allowlist table against auth.jwt() email.
-- =====================================================

-- =====================================================
-- 1. Create is_admin() function if it doesn't exist
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
BEGIN
  -- Get email from JWT claims
  user_email := auth.jwt() ->> 'email';

  -- Check if email is in admin allowlist
  IF user_email IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.admin_allowlist
    WHERE email = user_email
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- =====================================================
-- 2. Add alt column to project_images if not exists
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'project_images' AND column_name = 'alt'
  ) THEN
    ALTER TABLE public.project_images ADD COLUMN alt text;
  END IF;
END $$;

-- =====================================================
-- 3. Enable RLS on tables
-- =====================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. Drop existing policies (if any) to avoid conflicts
-- =====================================================
DROP POLICY IF EXISTS "projects_select_published" ON public.projects;
DROP POLICY IF EXISTS "projects_select_admin" ON public.projects;
DROP POLICY IF EXISTS "projects_select_policy" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_admin" ON public.projects;
DROP POLICY IF EXISTS "projects_update_admin" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_admin" ON public.projects;

DROP POLICY IF EXISTS "project_images_select_published" ON public.project_images;
DROP POLICY IF EXISTS "project_images_select_admin" ON public.project_images;
DROP POLICY IF EXISTS "project_images_select_policy" ON public.project_images;
DROP POLICY IF EXISTS "project_images_insert_admin" ON public.project_images;
DROP POLICY IF EXISTS "project_images_update_admin" ON public.project_images;
DROP POLICY IF EXISTS "project_images_delete_admin" ON public.project_images;

-- =====================================================
-- 5. Projects Table Policies
-- =====================================================

-- Everyone (anon + authenticated) can SELECT published projects
-- Admins can also see unpublished projects
CREATE POLICY "projects_select_policy"
ON public.projects
FOR SELECT
USING (
  is_published = true
  OR public.is_admin() = true
);

-- Admin can INSERT new projects
CREATE POLICY "projects_insert_admin"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin() = true);

-- Admin can UPDATE any project
CREATE POLICY "projects_update_admin"
ON public.projects
FOR UPDATE
TO authenticated
USING (public.is_admin() = true)
WITH CHECK (public.is_admin() = true);

-- Admin can DELETE any project
CREATE POLICY "projects_delete_admin"
ON public.projects
FOR DELETE
TO authenticated
USING (public.is_admin() = true);

-- =====================================================
-- 6. Project Images Table Policies
-- =====================================================

-- Everyone can SELECT images for published projects
-- Admins can see all images
CREATE POLICY "project_images_select_policy"
ON public.project_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_images.project_id
    AND projects.is_published = true
  )
  OR public.is_admin() = true
);

-- Admin can INSERT new images
CREATE POLICY "project_images_insert_admin"
ON public.project_images
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin() = true);

-- Admin can UPDATE any image
CREATE POLICY "project_images_update_admin"
ON public.project_images
FOR UPDATE
TO authenticated
USING (public.is_admin() = true)
WITH CHECK (public.is_admin() = true);

-- Admin can DELETE any image
CREATE POLICY "project_images_delete_admin"
ON public.project_images
FOR DELETE
TO authenticated
USING (public.is_admin() = true);

-- =====================================================
-- 7. Storage Bucket Policies (portfolio bucket)
-- =====================================================
-- Note: Storage policies are set in Supabase Dashboard
-- or via supabase CLI. The following is for reference.

-- Create the portfolio bucket if it doesn't exist
-- (Run this manually in Supabase SQL Editor if needed)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('portfolio', 'portfolio', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage SELECT policy (public read for portfolio images)
-- This allows anyone to view portfolio images via public URLs

-- Storage INSERT policy (admin only)
-- DROP POLICY IF EXISTS "portfolio_insert_admin" ON storage.objects;
-- CREATE POLICY "portfolio_insert_admin"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'portfolio' AND
--   public.is_admin() = true
-- );

-- Storage UPDATE policy (admin only)
-- DROP POLICY IF EXISTS "portfolio_update_admin" ON storage.objects;
-- CREATE POLICY "portfolio_update_admin"
-- ON storage.objects
-- FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'portfolio' AND public.is_admin() = true)
-- WITH CHECK (bucket_id = 'portfolio' AND public.is_admin() = true);

-- Storage DELETE policy (admin only)
-- DROP POLICY IF EXISTS "portfolio_delete_admin" ON storage.objects;
-- CREATE POLICY "portfolio_delete_admin"
-- ON storage.objects
-- FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'portfolio' AND public.is_admin() = true);

-- =====================================================
-- 8. Create indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_sort_order ON public.project_images(project_id, sort_order);

-- =====================================================
-- 9. Verification queries (run manually to test)
-- =====================================================
-- Test 1: As anon, should only see published projects
-- SELECT * FROM projects; -- should show is_published=true only

-- Test 2: As anon, should only see images for published projects
-- SELECT * FROM project_images; -- should show images for published projects only

-- Test 3: As admin, should see all projects
-- SELECT * FROM projects; -- should show all

-- Test 4: As anon, INSERT should fail
-- INSERT INTO projects (title, slug, service_type, description)
-- VALUES ('Test', 'test', 'Test', 'Test'); -- should fail

-- Test 5: As admin, INSERT should succeed
-- INSERT INTO projects (title, slug, service_type, description, is_published)
-- VALUES ('Admin Test', 'admin-test', 'Test', 'Test', false); -- should succeed
