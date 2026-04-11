-- Add blur_data_url column to project_images
-- Stores a tiny (~500 byte) base64 PNG data URL generated at upload time.
-- Used for blur-up placeholder effect — avoids re-fetching images at request time.

ALTER TABLE public.project_images
  ADD COLUMN IF NOT EXISTS blur_data_url TEXT;
