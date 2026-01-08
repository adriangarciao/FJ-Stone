import { z } from 'zod';

export const quoteRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  service_type: z.string().min(1, 'Please select a service type'),
  location: z.string().optional(),
  description: z.string().min(10, 'Please describe your project (at least 10 characters)'),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;
