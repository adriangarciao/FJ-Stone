import { getPublishedProjects } from '@/lib/supabase/queries';
import { serviceTypes } from '@/lib/dummy-data';
import PortfolioPageClient from './PortfolioPageClient';

export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();
  const filters = ['All', ...serviceTypes.filter((t) => t !== 'Other')];

  return <PortfolioPageClient projects={projects} filters={filters} />;
}
