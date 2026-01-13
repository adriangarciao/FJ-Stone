import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/supabase/queries';
import { serviceTypes } from '@/lib/dummy-data';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get a free quote for your hardscaping project. Contact F&J Stone Services for patios, retaining walls, outdoor kitchens, and more in the Greater Chicago Area.',
  openGraph: {
    title: 'Contact Us | Get a Free Quote',
    description:
      'Get a free quote for your hardscaping project. Contact us for patios, retaining walls, outdoor kitchens, and more.',
  },
};

export const revalidate = 60;

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();

  return (
    <ContactPageClient
      siteSettings={siteSettings}
      serviceTypes={serviceTypes}
    />
  );
}
