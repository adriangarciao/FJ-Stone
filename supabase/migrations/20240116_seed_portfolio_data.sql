-- =====================================================
-- Portfolio Data Migration
-- =====================================================
-- This script migrates the hardcoded portfolio data
-- from src/data/portfolioImages.ts into the database.
-- =====================================================

-- First, let's clear any existing test data (optional - comment out if you want to keep existing)
-- DELETE FROM public.project_images;
-- DELETE FROM public.projects;

-- =====================================================
-- INSERT PROJECTS
-- =====================================================

INSERT INTO public.projects (id, title, slug, location, service_type, description, featured, is_published, created_at)
VALUES
  (gen_random_uuid(), '410 Modern Brick Residence', '410-residence-brick', 'Chicagoland Area', 'Residential Masonry', 'Complete exterior brick work for a modern two-story home featuring white brick with black trim accents and natural wood porch columns.', true, true, '2024-11-15'::timestamptz),
  (gen_random_uuid(), 'Outdoor Fireplace & Bluestone Patio', 'outdoor-fireplace-patio', 'Chicagoland Area', 'Fire Feature', 'Custom outdoor fireplace built with cream-colored brick featuring built-in wood storage niches, paired with a bluestone paver patio.', true, true, '2024-10-15'::timestamptz),
  (gen_random_uuid(), 'Modern Home Concrete Patio', 'modern-white-siding-patio', 'Chicagoland Area', 'Patio', 'Large-format concrete paver patio installation for a contemporary white-sided home with black trim accents.', true, true, '2024-09-15'::timestamptz),
  (gen_random_uuid(), 'Ranch Home Paver Walkway', 'brick-ranch-paver-walkway', 'Chicagoland Area', 'Walkway', 'Charcoal and gray paver walkway installation connecting entryways at a brick ranch home.', true, true, '2024-08-15'::timestamptz),
  (gen_random_uuid(), 'Backyard Patio with Pergola', 'backyard-patio-pergola', 'Chicagoland Area', 'Patio', 'Large format cream-colored paver patio installation in a backyard with cedar pergola and outdoor grill area.', true, true, '2024-07-15'::timestamptz),
  (gen_random_uuid(), 'Residential Patio with Landscaping', 'backyard-patio-trees', 'Chicagoland Area', 'Patio', 'Charcoal gray paver patio surrounded by mature evergreens and established landscaping.', true, true, '2024-06-15'::timestamptz),
  (gen_random_uuid(), 'Covered Pavilion with Stone Fireplace', 'limestone-seating-wall', 'Chicagoland Area', 'Outdoor Kitchen', 'Natural limestone seating wall and covered pavilion with stone fireplace and bluestone patio.', false, true, '2024-05-15'::timestamptz),
  (gen_random_uuid(), 'Commercial Concrete Sidewalk', 'commercial-concrete-work', 'Chicagoland Area', 'Other', 'Commercial concrete sidewalk installation at a shopping plaza with masonry block building.', false, true, '2024-04-15'::timestamptz),
  (gen_random_uuid(), 'Taco Pros Restaurant Concrete Pad', 'taco-pros-concrete', 'Chicagoland Area', 'Other', 'Commercial concrete pad and sidewalk installation at Taco Pros restaurant location.', false, true, '2024-03-15'::timestamptz),
  (gen_random_uuid(), 'Dunkin'' Donuts Parking Area', 'dunkin-donuts-concrete', 'Chicagoland Area', 'Other', 'Commercial concrete work at Dunkin'' Donuts location including parking area and sidewalks.', false, true, '2024-02-15'::timestamptz),
  (gen_random_uuid(), 'Tudor Home Flagstone Walkway', 'flagstone-walkway-tudor', 'Chicagoland Area', 'Walkway', 'Natural flagstone walkway with brick border leading to a classic Tudor-style brick home.', false, true, '2024-01-15'::timestamptz),
  (gen_random_uuid(), 'Side Yard Concrete Walkway', 'side-yard-walkway', 'Chicagoland Area', 'Walkway', 'Clean concrete paver walkway along the side of a residential home with decorative rock border.', false, true, '2023-12-15'::timestamptz),
  (gen_random_uuid(), 'Unilock Patio with Seating Wall', 'unilock-patio-wall', 'Chicagoland Area', 'Patio', 'Unilock paver patio installation with custom stone seating wall in residential backyard.', false, true, '2023-11-15'::timestamptz),
  (gen_random_uuid(), 'New Construction Stone Veneer', 'new-construction-stone-veneer', 'Chicagoland Area', 'Other', 'Natural stone veneer installation on new construction home with covered porch area.', false, true, '2023-10-15'::timestamptz),
  (gen_random_uuid(), 'Residential Paver Driveway', 'paver-driveway', 'Chicagoland Area', 'Driveway', 'Full paver driveway installation with contrasting border pattern at residential home.', false, true, '2023-09-15'::timestamptz),
  (gen_random_uuid(), 'Landscape Retaining Wall', 'retaining-wall-landscape', 'Chicagoland Area', 'Retaining Wall', 'Natural stone retaining wall installation for landscape grade management.', false, true, '2023-08-15'::timestamptz),
  (gen_random_uuid(), 'Interior Stacked Stone Fireplace', 'interior-stone-fireplace', 'Chicagoland Area', 'Fire Feature', 'Floor-to-ceiling stacked stone fireplace installation in vaulted living room.', false, true, '2023-07-15'::timestamptz),
  (gen_random_uuid(), 'Fire Pit with Flagstone Patio', 'firepit-stepping-stones', 'Chicagoland Area', 'Fire Feature', 'Circular flagstone patio with brick fire pit and natural stepping stone path at Tudor home.', false, true, '2023-06-15'::timestamptz),
  (gen_random_uuid(), 'Multi-Family Brick Construction', 'multi-family-brick', 'Chicagoland Area', 'Other', 'Brick exterior construction on new multi-family residential building.', false, true, '2023-05-15'::timestamptz),
  (gen_random_uuid(), 'Winter Ranch Home Brick Work', 'winter-brick-ranch', 'Chicagoland Area', 'Other', 'Brick exterior work on ranch-style home during winter conditions.', false, true, '2023-04-15'::timestamptz),
  (gen_random_uuid(), 'Backyard Fire Pit Installation', 'backyard-firepit', 'Chicagoland Area', 'Fire Feature', 'Circular stone fire pit with paver base in residential backyard setting.', false, true, '2023-03-15'::timestamptz),
  (gen_random_uuid(), 'Natural Stone Interior Fireplace', 'interior-natural-stone-fireplace', 'Chicagoland Area', 'Fire Feature', 'Traditional natural stone fireplace with wood beam mantel in living room.', false, true, '2023-02-15'::timestamptz),
  (gen_random_uuid(), 'Traditional Brick Chimney', 'brick-chimney', 'Chicagoland Area', 'Other', 'New brick chimney construction on white colonial-style home.', false, true, '2023-01-15'::timestamptz),
  (gen_random_uuid(), 'Gazebo Curved Stonework', 'gazebo-stonework', 'Chicagoland Area', 'Patio', 'Curved concrete step and gravel border installation around elegant white gazebo.', false, true, '2022-12-15'::timestamptz),
  (gen_random_uuid(), 'Residential Paver Walkway', 'paver-walkway-residential', 'Chicagoland Area', 'Walkway', 'Mixed-tone paver walkway installation along residential home.', false, true, '2022-11-15'::timestamptz),
  (gen_random_uuid(), 'Decorative Stone Mailbox Post', 'mailbox-post-stonework', 'Chicagoland Area', 'Other', 'Custom stone mailbox post enclosure with integrated lighting.', false, true, '2022-10-15'::timestamptz)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- INSERT PROJECT IMAGES
-- =====================================================
-- Note: These use local /images/ paths. When you upload images
-- to Supabase Storage, you'll need to update storage_path values.

-- 410 Modern Brick Residence
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/0BA7ABEC-B3EB-4F73-A1F0-7880C507647C_1_105_c.jpeg', 'Full front facade showcasing white brick exterior with contemporary black window frames and covered front porch', 'Front view of 410 residence', 0
FROM public.projects p WHERE p.slug = '410-residence-brick';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/0D2434A2-0F2D-490D-BE52-2E7A92F36A11_1_105_c.jpeg', 'Angled view highlighting the architectural details and natural wood porch posts', '410 residence alternate angle', 1
FROM public.projects p WHERE p.slug = '410-residence-brick';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/09ACDF43-4F23-49BE-B57E-4C8BE9E47859_1_105_c.jpeg', 'Close-up of precision brick work around triple-pane windows with stone sill detail', 'Window detail at 410 residence', 2
FROM public.projects p WHERE p.slug = '410-residence-brick';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/67C7BD56-A300-44E7-AE11-566A95CCDD29_1_105_c.jpeg', 'Side elevation showing consistent brick coursing and window integration', 'Side brick detail', 3
FROM public.projects p WHERE p.slug = '410-residence-brick';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/7AFE49EB-41DC-4763-BD38-CCFBF2A9627D_1_105_c.jpeg', 'Street view of completed residence nestled among mature landscaping', '410 residence with mature tree', 4
FROM public.projects p WHERE p.slug = '410-residence-brick';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/A08EEA7F-92D9-4F6F-93E6-2C03DFA2FBDF_1_105_c.jpeg', 'Detail of white brick pattern and black trim coordination', 'Brick facade close-up', 5
FROM public.projects p WHERE p.slug = '410-residence-brick';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/A41EE63A-9DF7-44FF-AFB3-841C4CE70B22_1_105_c.jpeg', 'Welcoming front entry with covered porch and brick detailing', 'Front entry view', 6
FROM public.projects p WHERE p.slug = '410-residence-brick';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/AB8207D4-CA1B-4220-8655-8AC43D388163_1_105_c.jpeg', 'Complete view of the finished residence from the street', 'Full property view', 7
FROM public.projects p WHERE p.slug = '410-residence-brick';

-- Outdoor Fireplace & Bluestone Patio
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/0834B227-14FC-4BBC-8EA1-FFA883885AA5_1_105_c.jpeg', 'Custom brick outdoor fireplace with dual wood storage compartments and copper chimney cap', 'Outdoor fireplace front view', 0
FROM public.projects p WHERE p.slug = 'outdoor-fireplace-patio';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/37B30BC7-57DD-4BAD-A916-F5D72D6251C7_1_105_c.jpeg', 'Full view of the fireplace with bluestone patio installation in progress', 'Outdoor fireplace with patio', 1
FROM public.projects p WHERE p.slug = 'outdoor-fireplace-patio';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/81C4B379-46BF-412A-B5A1-D6F54C804322_1_105_c.jpeg', 'Completed fireplace showing clean brick work and integrated seating walls', 'Fireplace detail view', 2
FROM public.projects p WHERE p.slug = 'outdoor-fireplace-patio';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/F9C87C43-166D-441F-B9F0-310204055CE0_1_105_c.jpeg', 'Final touches being applied to the outdoor fireplace and patio area', 'Fireplace with worker', 3
FROM public.projects p WHERE p.slug = 'outdoor-fireplace-patio';

-- Modern Home Concrete Patio
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/285D1A83-1ACB-4929-B7E5-E32F20C29482_1_105_c.jpeg', 'Expansive concrete paver patio complementing the modern farmhouse aesthetic', 'Modern home patio', 0
FROM public.projects p WHERE p.slug = 'modern-white-siding-patio';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/5402EED8-87E0-455A-B505-FB8ECA2F99BA_1_105_c.jpeg', 'Large-format pavers creating a clean, contemporary outdoor living space', 'Backyard patio view', 1
FROM public.projects p WHERE p.slug = 'modern-white-siding-patio';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/55FEBE1D-B6B2-4CA3-A6F0-C932E1497ED1_1_105_c.jpeg', 'Complete backyard transformation with new patio and walkway', 'Backyard full view', 2
FROM public.projects p WHERE p.slug = 'modern-white-siding-patio';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/CB7C01DD-714B-42C2-9A68-0CD6E76826B5_1_105_c.jpeg', 'Concrete walkway leading through the backyard', 'Walkway and patio', 3
FROM public.projects p WHERE p.slug = 'modern-white-siding-patio';

-- Ranch Home Paver Walkway
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/0BC4764A-4D70-42EF-AFC7-E80351D67616_1_105_c.jpeg', 'Multi-toned paver walkway with random pattern alongside brick ranch home', 'Paver walkway side view', 0
FROM public.projects p WHERE p.slug = 'brick-ranch-paver-walkway';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/588AAD38-0528-4C23-AE36-BC3C60CEC66E_1_105_c.jpeg', 'Paver pathway extending through covered breezeway connecting home sections', 'Covered walkway view', 1
FROM public.projects p WHERE p.slug = 'brick-ranch-paver-walkway';

-- Backyard Patio with Pergola
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/12751E82-0A2C-4BEE-A2BB-37804F8983C5_1_105_c.jpeg', 'Large format paver installation creating generous outdoor living space', 'Patio under construction', 0
FROM public.projects p WHERE p.slug = 'backyard-patio-pergola';

-- Residential Patio with Landscaping
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/158AC9A7-D459-4A8D-8D0A-7236EBF09AB8_1_105_c.jpeg', 'Freshly sealed patio pavers showcasing rich gray tones among lush landscaping', 'Patio with evergreens', 0
FROM public.projects p WHERE p.slug = 'backyard-patio-trees';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/80AEF9C2-11A9-4C96-9D2C-26A952E84EE3_1_105_c.jpeg', 'Stamped concrete patio creating elegant outdoor entertaining space', 'Patio near white home', 1
FROM public.projects p WHERE p.slug = 'backyard-patio-trees';

-- Covered Pavilion with Stone Fireplace
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/1ED59034-25A7-4290-AE74-651000386F17_4_5005_c.jpeg', 'Natural limestone seating wall taking shape with paver patio foundation', 'Limestone wall in progress', 0
FROM public.projects p WHERE p.slug = 'limestone-seating-wall';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/8C6D78EA-AF10-4CD8-9E3C-C9D51ACE92CC_1_105_c.jpeg', 'Natural limestone wall construction showing traditional dry-stack technique', 'Limestone wall construction', 1
FROM public.projects p WHERE p.slug = 'limestone-seating-wall';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/9DF216A3-CFE2-4925-99B6-9D515C92B6F0_1_105_c.jpeg', 'Completed outdoor pavilion featuring stone fireplace and bluestone patio', 'Covered pavilion with fireplace', 2
FROM public.projects p WHERE p.slug = 'limestone-seating-wall';

-- Commercial Concrete Sidewalk
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/3502BAF2-A98B-4EFB-9D79-31837D546FEC_1_105_c.jpeg', 'Fresh concrete pour for commercial sidewalk at retail plaza', 'Commercial concrete pour', 0
FROM public.projects p WHERE p.slug = 'commercial-concrete-work';

-- Taco Pros Restaurant Concrete Pad
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/3BCD50B8-4F83-4B79-B3F0-1EBBFEF3A90C_4_5005_c.jpeg', 'Freshly poured and finished concrete pad at Taco Pros restaurant entrance', 'Taco Pros concrete pad', 0
FROM public.projects p WHERE p.slug = 'taco-pros-concrete';

-- Dunkin' Donuts Parking Area
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/59AC0672-553C-4308-8724-5329C1E466FA_1_105_c.jpeg', 'Completed concrete pad and sidewalk at Dunkin'' Donuts drive-through area', 'Dunkin Donuts concrete', 0
FROM public.projects p WHERE p.slug = 'dunkin-donuts-concrete';

-- Tudor Home Flagstone Walkway
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/5E3D4375-386D-4C1F-AC5F-36319F98C214_1_105_c.jpeg', 'Winding natural flagstone path with brick edging through shaded garden', 'Flagstone walkway', 0
FROM public.projects p WHERE p.slug = 'flagstone-walkway-tudor';

-- Side Yard Concrete Walkway
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/65E4B190-8B28-4DF2-A1A2-8830F6443B44_1_105_c.jpeg', 'Large format concrete pavers creating accessible side yard pathway', 'Side yard walkway', 0
FROM public.projects p WHERE p.slug = 'side-yard-walkway';

-- Unilock Patio with Seating Wall
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/6DF5922B-CF4E-43F4-8819-AADA954E02F7_1_105_c.jpeg', 'Tumbled stone seating wall construction with Unilock paver patio', 'Unilock patio construction', 0
FROM public.projects p WHERE p.slug = 'unilock-patio-wall';

-- New Construction Stone Veneer
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/6E967199-7AA5-41CE-933A-3882E961C22D_1_105_c.jpeg', 'Gray limestone veneer application on new home construction with Pella windows', 'Stone veneer construction', 0
FROM public.projects p WHERE p.slug = 'new-construction-stone-veneer';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/A0906F3A-8497-4926-A78B-F72BA0C2D15D_1_105_c.jpeg', 'Two-story stone veneer installation showcasing varied stone sizes and textures', 'Full stone facade', 1
FROM public.projects p WHERE p.slug = 'new-construction-stone-veneer';

-- Residential Paver Driveway
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/73A1BE3C-0FE1-461F-AF66-2AEE21419E70_1_105_c.jpeg', 'Interlocking paver driveway with dark border accent extending to garage', 'Paver driveway', 0
FROM public.projects p WHERE p.slug = 'paver-driveway';

-- Landscape Retaining Wall
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/7AFB6119-69B5-442B-8612-EA9ADE730550_4_5005_c.jpeg', 'Curved natural stone retaining wall blending seamlessly with landscape', 'Retaining wall', 0
FROM public.projects p WHERE p.slug = 'retaining-wall-landscape';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/F1B772B6-F4A6-4213-BCC0-E8C44A9D9719_4_5005_c.jpeg', 'Extended stone retaining wall following natural terrain contours', 'Retaining wall detail', 1
FROM public.projects p WHERE p.slug = 'retaining-wall-landscape';

-- Interior Stacked Stone Fireplace
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/8552BD59-EFAC-42FF-981E-6A4F56C9DDF2_1_105_c.jpeg', 'Dramatic floor-to-vaulted-ceiling stacked stone fireplace with TV mount integration', 'Stacked stone fireplace', 0
FROM public.projects p WHERE p.slug = 'interior-stone-fireplace';

-- Fire Pit with Flagstone Patio
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/822B1446-E587-45C5-B655-141F78127DCA_1_105_c.jpeg', 'Natural stepping stone path leading to circular fire pit area', 'Stepping stones to fire pit', 0
FROM public.projects p WHERE p.slug = 'firepit-stepping-stones';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/8266D80D-6C3D-4094-8465-855A7B4FB7F0_1_105_c.jpeg', 'Completed flagstone patio with brick fire pit and log seating', 'Fire pit patio complete', 1
FROM public.projects p WHERE p.slug = 'firepit-stepping-stones';

INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/FCEEF6FF-72C3-4EAF-9CEE-956F3367D4A1_1_105_c.jpeg', 'Rustic fire pit area perfectly complementing the Tudor-style architecture', 'Fire pit with Tudor home', 2
FROM public.projects p WHERE p.slug = 'firepit-stepping-stones';

-- Multi-Family Brick Construction
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/AC18005E-CC1A-48E1-9F41-8BBAC71A7DCE_1_105_c.jpeg', 'Traditional brick facade on new multi-family construction project', 'Multi-family brick building', 0
FROM public.projects p WHERE p.slug = 'multi-family-brick';

-- Winter Ranch Home Brick Work
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/B6881536-2380-4C42-87D9-9137A1F3C2F2_4_5005_c.jpeg', 'Completed brick work on ranch home photographed in winter snow', 'Brick ranch in snow', 0
FROM public.projects p WHERE p.slug = 'winter-brick-ranch';

-- Backyard Fire Pit Installation
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/BB37DE33-A631-42DA-857F-96D688BCE43A_4_5005_c.jpeg', 'Two-tier stone fire pit with square paver base and landscape integration', 'Backyard fire pit', 0
FROM public.projects p WHERE p.slug = 'backyard-firepit';

-- Natural Stone Interior Fireplace
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/BE8C7B11-7127-4C39-8667-372113C9B927_1_105_c.jpeg', 'Rustic natural stone fireplace with reclaimed wood mantel and traditional arch', 'Natural stone fireplace', 0
FROM public.projects p WHERE p.slug = 'interior-natural-stone-fireplace';

-- Traditional Brick Chimney
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/C20B505D-CD84-431F-80A5-41FACA97E394_1_105_c.jpeg', 'Classic red brick chimney rising along the exterior of colonial home', 'Brick chimney', 0
FROM public.projects p WHERE p.slug = 'brick-chimney';

-- Gazebo Curved Stonework
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/D2463DC7-1486-4503-96EA-C692C327BB0F_1_105_c.jpeg', 'Curved concrete steps and white gravel border enhancing classic gazebo', 'Gazebo stonework', 0
FROM public.projects p WHERE p.slug = 'gazebo-stonework';

-- Residential Paver Walkway
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/E2566753-6896-455C-B1EC-F5A14BEF1740_4_5005_c.jpeg', 'Dual-tone paver walkway with brick border along side of home', 'Mixed paver walkway', 0
FROM public.projects p WHERE p.slug = 'paver-walkway-residential';

-- Decorative Stone Mailbox Post
INSERT INTO public.project_images (id, project_id, storage_path, caption, alt, sort_order)
SELECT gen_random_uuid(), p.id, '/images/EA21903D-D4B8-427B-A2F2-69A4BC8BC784_1_105_c.jpeg', 'Custom tumbled stone mailbox enclosure at rural property entrance', 'Stone mailbox post', 0
FROM public.projects p WHERE p.slug = 'mailbox-post-stonework';

-- =====================================================
-- Verification
-- =====================================================
-- Run these to verify the migration:
-- SELECT COUNT(*) as project_count FROM public.projects;
-- SELECT COUNT(*) as image_count FROM public.project_images;
-- SELECT p.title, COUNT(pi.id) as image_count 
-- FROM public.projects p 
-- LEFT JOIN public.project_images pi ON p.id = pi.project_id 
-- GROUP BY p.id, p.title;
