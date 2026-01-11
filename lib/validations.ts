import { z } from 'zod';

// Security: Prevent header injection by disallowing CR/LF characters
const noHeaderInjection = (val: string) => !val.includes('\r') && !val.includes('\n');

// Allowed MIME types for file uploads
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

// File upload constraints
export const FILE_CONSTRAINTS = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  maxFiles: 5,
  allowedTypes: ALLOWED_MIME_TYPES,
};

/**
 * Normalize a phone number to digits only.
 * Strips all non-digit characters (parentheses, dashes, spaces, etc.)
 */
export function normalizePhone(input: string): string {
  return input.replace(/\D/g, '');
}

/**
 * Validate a US phone number.
 * Accepts 10 digits (standard) or 11 digits starting with "1" (with country code).
 */
function isValidUSPhone(digits: string): boolean {
  if (digits.length === 10) {
    return true;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return true;
  }
  return false;
}

export const quoteRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be 80 characters or less')
    .transform((val) => val.trim())
    .refine(noHeaderInjection, 'Invalid characters in name'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(30, 'Phone number is too long')
    .transform((val) => normalizePhone(val.trim()))
    .refine(
      (digits) => isValidUSPhone(digits),
      'Please enter a valid 10-digit US phone number'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(120, 'Email must be 120 characters or less')
    .transform((val) => val.trim().toLowerCase())
    .refine(noHeaderInjection, 'Invalid characters in email'),
  service_type: z
    .string()
    .min(1, 'Please select a service type')
    .max(100, 'Service type is too long')
    .refine(noHeaderInjection, 'Invalid characters in service type'),
  location: z
    .string()
    .min(2, 'Location is required (City or Address)')
    .max(120, 'Location must be 120 characters or less')
    .transform((val) => val.trim())
    .refine(noHeaderInjection, 'Invalid characters in location'),
  description: z
    .string()
    .min(10, 'Please describe your project (at least 10 characters)')
    .max(2000, 'Description must be 2000 characters or less')
    .transform((val) => val.trim()),
  preferred_contact: z
    .enum(['phone', 'email', 'either'])
    .optional(),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;

// Validate a single file
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_CONSTRAINTS.maxSizeBytes) {
    return { valid: false, error: `File "${file.name}" exceeds 5MB limit` };
  }

  if (!FILE_CONSTRAINTS.allowedTypes.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
    return { valid: false, error: `File "${file.name}" has invalid type. Allowed: JPEG, PNG, WebP` };
  }

  return { valid: true };
}

// Validate all files
export function validateFiles(files: File[]): { valid: boolean; error?: string } {
  if (files.length > FILE_CONSTRAINTS.maxFiles) {
    return { valid: false, error: `Maximum ${FILE_CONSTRAINTS.maxFiles} files allowed` };
  }

  for (const file of files) {
    const result = validateFile(file);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
}
