import type { Metadata } from 'next';
import { getPageContentBlocks } from '@/lib/supabase/content-queries';
import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Professional hardscaping services including patio installation, retaining walls, walkways, driveways, outdoor kitchens, and fire features. Free consultations available.',
  openGraph: {
    title: 'Our Services',
    description:
      'Professional hardscaping services including patio installation, retaining walls, walkways, driveways, outdoor kitchens, and fire features.',
  },
};

export default async function ServicesPage() {
  // Fetch all content blocks for the services page
  const contentBlocks = await getPageContentBlocks('services');

  return <ServicesPageClient contentBlocks={contentBlocks} />;
}

