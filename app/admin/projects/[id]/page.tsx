import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/supabase/admin-queries';
import ProjectFormClient from '../ProjectFormClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Project</h1>
      <p className="text-gray-600 mb-8">Update project details and images.</p>

      <ProjectFormClient project={project} />
    </div>
  );
}
