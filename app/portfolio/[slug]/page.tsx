import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getPublishedProjects } from '@/lib/supabase/queries';
import ProjectDetailClient from './ProjectDetailClient';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const firstImage = project.images?.[0]?.url;

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'article',
      images: firstImage
        ? [
            {
              url: firstImage,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: firstImage ? [firstImage] : undefined,
    },
  };
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
