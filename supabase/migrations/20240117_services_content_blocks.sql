-- =====================================================
-- Services Page Content Blocks
-- =====================================================
-- This script seeds the content_blocks table with editable
-- content for the services page.
-- =====================================================

-- Hero Section
INSERT INTO public.content_blocks (key, page, block_type, value)
VALUES
  ('services.hero.headline', 'services', 'text', '{"text": "Our Services"}'),
  ('services.hero.subheadline', 'services', 'text', '{"text": "From concept to completion, we offer comprehensive hardscaping services to transform your outdoor space into something extraordinary."}')
ON CONFLICT (key) DO NOTHING;

-- Patio Installation Service
INSERT INTO public.content_blocks (key, page, block_type, value)
VALUES
  ('services.patio.title', 'services', 'text', '{"text": "Patio Installation"}'),
  ('services.patio.description', 'services', 'text', '{"text": "Custom patios designed to enhance your outdoor living space. From natural stone to pavers, we create beautiful, functional areas for entertaining and relaxation."}'),
  ('services.patio.feature1', 'services', 'text', '{"text": "Natural stone patios"}'),
  ('services.patio.feature2', 'services', 'text', '{"text": "Paver installations"}'),
  ('services.patio.feature3', 'services', 'text', '{"text": "Custom designs"}'),
  ('services.patio.feature4', 'services', 'text', '{"text": "Drainage solutions"}')
ON CONFLICT (key) DO NOTHING;

-- Retaining Walls Service
INSERT INTO public.content_blocks (key, page, block_type, value)
VALUES
  ('services.retaining-walls.title', 'services', 'text', '{"text": "Retaining Walls"}'),
  ('services.retaining-walls.description', 'services', 'text', '{"text": "Structural and decorative retaining walls that combine functionality with aesthetics. Perfect for managing slopes and creating usable outdoor space."}'),
  ('services.retaining-walls.feature1', 'services', 'text', '{"text": "Structural engineering"}'),
  ('services.retaining-walls.feature2', 'services', 'text', '{"text": "Natural stone walls"}'),
  ('services.retaining-walls.feature3', 'services', 'text', '{"text": "Block retaining walls"}'),
  ('services.retaining-walls.feature4', 'services', 'text', '{"text": "Terraced gardens"}')
ON CONFLICT (key) DO NOTHING;

-- Walkways & Paths Service
INSERT INTO public.content_blocks (key, page, block_type, value)
VALUES
  ('services.walkways.title', 'services', 'text', '{"text": "Walkways & Paths"}'),
  ('services.walkways.description', 'services', 'text', '{"text": "Elegant walkways and garden paths that guide visitors through your landscape while adding curb appeal and value to your property."}'),
  ('services.walkways.feature1', 'services', 'text', '{"text": "Flagstone paths"}'),
  ('services.walkways.feature2', 'services', 'text', '{"text": "Paver walkways"}'),
  ('services.walkways.feature3', 'services', 'text', '{"text": "Stepping stones"}'),
  ('services.walkways.feature4', 'services', 'text', '{"text": "Accessible design"}')
ON CONFLICT (key) DO NOTHING;

-- Driveways Service
INSERT INTO public.content_blocks (key, page, block_type, value)
VALUES
  ('services.driveways.title', 'services', 'text', '{"text": "Driveways"}'),
  ('services.driveways.description', 'services', 'text', '{"text": "Durable, attractive driveways built to handle daily use while making a great first impression. Multiple material options available."}'),
  ('services.driveways.feature1', 'services', 'text', '{"text": "Paver driveways"}'),
  ('services.driveways.feature2', 'services', 'text', '{"text": "Concrete work"}'),
  ('services.driveways.feature3', 'services', 'text', '{"text": "Drainage systems"}'),
  ('services.driveways.feature4', 'services', 'text', '{"text": "Border accents"}')
ON CONFLICT (key) DO NOTHING;

-- Outdoor Kitchens Service
INSERT INTO public.content_blocks (key, page, block_type, value)
VALUES
  ('services.outdoor-kitchens.title', 'services', 'text', '{"text": "Outdoor Kitchens"}'),
  ('services.outdoor-kitchens.description', 'services', 'text', '{"text": "Complete outdoor kitchen installations featuring built-in grills, countertops, and custom stonework for the ultimate backyard experience."}'),
  ('services.outdoor-kitchens.feature1', 'services', 'text', '{"text": "Built-in grills"}'),
  ('services.outdoor-kitchens.feature2', 'services', 'text', '{"text": "Stone countertops"}'),
  ('services.outdoor-kitchens.feature3', 'services', 'text', '{"text": "Pizza ovens"}'),
  ('services.outdoor-kitchens.feature4', 'services', 'text', '{"text": "Bar seating areas"}')
ON CONFLICT (key) DO NOTHING;

-- Fire Features Service
INSERT INTO public.content_blocks (key, page, block_type, value)
VALUES
  ('services.fire-features.title', 'services', 'text', '{"text": "Fire Features"}'),
  ('services.fire-features.description', 'services', 'text', '{"text": "Fire pits and outdoor fireplaces that create a warm gathering spot for family and friends. Custom designs to match your style."}'),
  ('services.fire-features.feature1', 'services', 'text', '{"text": "Fire pits"}'),
  ('services.fire-features.feature2', 'services', 'text', '{"text": "Outdoor fireplaces"}'),
  ('services.fire-features.feature3', 'services', 'text', '{"text": "Gas & wood burning"}'),
  ('services.fire-features.feature4', 'services', 'text', '{"text": "Seating walls"}')
ON CONFLICT (key) DO NOTHING;

-- CTA Section
INSERT INTO public.content_blocks (key, page, block_type, value)
VALUES
  ('services.cta.headline', 'services', 'text', '{"text": "Ready to Start Your Project?"}'),
  ('services.cta.subheadline', 'services', 'text', '{"text": "Contact us today for a free consultation. We''ll help you choose the right services for your property and budget."}')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- Verification
-- =====================================================
-- Run this to verify the migration:
-- SELECT key, page FROM public.content_blocks WHERE page = 'services' ORDER BY key;
