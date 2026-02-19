-- =====================================================
-- Performance Index Migration
--
-- The featured-projects query (homepage) filters on two boolean
-- columns and sorts by created_at. Having separate single-column
-- indexes on is_published and featured forces PostgreSQL to do a
-- bitmap AND of both indexes and then a separate filesort for the
-- ORDER BY. A single composite index covers the filter and the
-- sort in one pass.
--
-- Query covered:
--   WHERE is_published = true AND featured = true
--   ORDER BY created_at DESC
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_published_featured_created
  ON public.projects (is_published, featured, created_at DESC);
