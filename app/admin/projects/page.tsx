import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllProjects } from '@/lib/supabase/admin-queries';
import ProjectsTableClient from './ProjectsTableClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">Manage your portfolio projects.</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="bg-[#990303] hover:bg-[#71706e] text-white border-2 border-white px-6 py-3 font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Project
        </Link>
      </div>

      {projects.length > 0 ? (
        <ProjectsTableClient projects={projects} />
      ) : (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 text-[#990303] hover:text-[#71706e] font-medium"
          >
            <Plus size={18} />
            Create your first project
          </Link>
        </div>
      )}
    </div>
  );
}

