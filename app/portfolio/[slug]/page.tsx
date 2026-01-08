import { notFound } from 'next/navigation';
import { getProjectBySlug, getPublishedProjects } from '@/lib/supabase/queries';
import ProjectDetailClient from './ProjectDetailClient';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
  ]);

  if (!project) {
    notFound();
  }

  // Get related projects (exclude current, limit to 3)
  const relatedProjects = allProjects
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <ProjectDetailClient
      project={project}
      relatedProjects={relatedProjects}
    />
  );
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
