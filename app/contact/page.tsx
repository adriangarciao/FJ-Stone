import { getSiteSettings } from '@/lib/supabase/queries';
import { serviceTypes } from '@/lib/dummy-data';
import ContactPageClient from './ContactPageClient';

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
