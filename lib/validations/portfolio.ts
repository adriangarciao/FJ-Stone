import { z } from 'zod';

// Security: Prevent header injection and HTML injection
const noInjection = (val: string) =>
  !val.includes('\r') &&
  !val.includes('\n') &&
  !/<script|<\/script|javascript:|on\w+=/i.test(val);

// URL-safe slug validation
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ============ PROJECT SCHEMAS ============

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(80, 'Title must be 80 characters or less')
    .transform((val) => val.trim())
    .refine(noInjection, 'Invalid characters in title'),
  service_type: z
    .string()
    .min(1, 'Service type is required')
    .max(40, 'Service type must be 40 characters or less')
    .transform((val) => val.trim())
    .refine(noInjection, 'Invalid characters in service type'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(4000, 'Description must be 4000 characters or less')
    .transform((val) => val.trim()),
  location: z
    .string()
    .max(120, 'Location must be 120 characters or less')
    .transform((val) => val.trim())
    .optional()
    .default(''),
  featured: z.boolean().optional().default(false),
  is_published: z.boolean().optional().default(false),
});

export const updateProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(80, 'Title must be 80 characters or less')
    .transform((val) => val.trim())
    .refine(noInjection, 'Invalid characters in title')
    .optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be 100 characters or less')
    .regex(slugRegex, 'Slug must be URL-safe (lowercase letters, numbers, hyphens)')
    .optional(),
  service_type: z
    .string()
    .min(1, 'Service type is required')
    .max(40, 'Service type must be 40 characters or less')
    .transform((val) => val.trim())
    .refine(noInjection, 'Invalid characters in service type')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(4000, 'Description must be 4000 characters or less')
    .transform((val) => val.trim())
    .optional(),
  location: z
    .string()
    .max(120, 'Location must be 120 characters or less')
    .transform((val) => val.trim())
    .optional(),
  featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
});

// ============ IMAGE SCHEMAS ============

export const updateImageSchema = z.object({
  caption: z
    .string()
    .max(140, 'Caption must be 140 characters or less')
    .transform((val) => val.trim())
    .refine((val) => !val || noInjection(val), 'Invalid characters in caption')
    .optional()
    .nullable(),
  alt: z
    .string()
    .max(140, 'Alt text must be 140 characters or less')
    .transform((val) => val.trim())
    .refine((val) => !val || noInjection(val), 'Invalid characters in alt text')
    .optional()
    .nullable(),
  sort_order: z.number().int().min(0).optional(),
});

export const reorderImagesSchema = z.object({
  orderedImageIds: z
    .array(z.string().uuid('Invalid image ID'))
    .min(1, 'At least one image ID required')
    .max(30, 'Cannot reorder more than 30 images'),
});

// ============ FILE VALIDATION ============

export const PORTFOLIO_FILE_CONSTRAINTS = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  maxFilesPerUpload: 10,
  maxImagesPerProject: 30,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'] as const,
};

export function validatePortfolioFile(file: File): { valid: boolean; error?: string } {
  if (file.size > PORTFOLIO_FILE_CONSTRAINTS.maxSizeBytes) {
    return { valid: false, error: `File "${file.name}" exceeds 5MB limit` };
  }

  if (
    !PORTFOLIO_FILE_CONSTRAINTS.allowedTypes.includes(
      file.type as (typeof PORTFOLIO_FILE_CONSTRAINTS.allowedTypes)[number]
    )
  ) {
    return {
      valid: false,
      error: `File "${file.name}" has invalid type. Allowed: JPEG, PNG, WebP`,
    };
  }

  return { valid: true };
}

export function validatePortfolioFiles(
  files: File[],
  existingImageCount: number = 0
): { valid: boolean; error?: string } {
  if (files.length > PORTFOLIO_FILE_CONSTRAINTS.maxFilesPerUpload) {
    return {
      valid: false,
      error: `Maximum ${PORTFOLIO_FILE_CONSTRAINTS.maxFilesPerUpload} files per upload`,
    };
  }

  const totalImages = existingImageCount + files.length;
  if (totalImages > PORTFOLIO_FILE_CONSTRAINTS.maxImagesPerProject) {
    return {
      valid: false,
      error: `Maximum ${PORTFOLIO_FILE_CONSTRAINTS.maxImagesPerProject} images per project`,
    };
  }

  for (const file of files) {
    const result = validatePortfolioFile(file);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}

// ============ SLUG HELPERS ============

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);
}

export function generateSafeFileName(projectId: string, originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = PORTFOLIO_FILE_CONSTRAINTS.allowedExtensions.includes(
    ext as (typeof PORTFOLIO_FILE_CONSTRAINTS.allowedExtensions)[number]
  )
    ? ext
    : 'jpg';

  const uuid = crypto.randomUUID();
  return `${projectId}/${uuid}.${safeExt}`;
}

// Re-export magic byte validation for use in admin uploads
export { validateFileMagicBytes } from '@/lib/validations';

// ============ TYPE EXPORTS ============

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateImageInput = z.infer<typeof updateImageSchema>;
export type ReorderImagesInput = z.infer<typeof reorderImagesSchema>;
