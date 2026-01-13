import type { Metadata } from 'next';
import { getPublishedProjects } from '@/lib/supabase/queries';
import { serviceTypes } from '@/lib/dummy-data';
import PortfolioPageClient from './PortfolioPageClient';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Browse our gallery of completed hardscaping projects including patios, retaining walls, outdoor kitchens, and more. See the quality craftsmanship that sets us apart.',
  openGraph: {
    title: 'Our Work | Portfolio',
    description:
      'Browse our gallery of completed hardscaping projects including patios, retaining walls, outdoor kitchens, and more.',
  },
};

export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();
  const filters = ['All', ...serviceTypes.filter((t) => t !== 'Other')];

  return <PortfolioPageClient projects={projects} filters={filters} />;
}
