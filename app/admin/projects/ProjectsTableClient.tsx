'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { deleteProject } from '@/app/actions/admin';
import { getProjectImageUrl } from '@/lib/supabase/storage';
import type { Project } from '@/lib/types';

interface ProjectsTableClientProps {
  projects: Project[];
}

export default function ProjectsTableClient({ projects }: ProjectsTableClientProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setDeletingId(projectId);
    const result = await deleteProject(projectId);
    setDeletingId(null);

    if (!result.success) {
      alert(result.error || 'Failed to delete project');
    }
  };

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                Project
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                Service Type
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                Location
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => {
              const imageUrl = project.images?.[0]
                ? getProjectImageUrl(project.images[0].storage_path)
                : null;

              return (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-gray-200 flex-shrink-0 relative overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {project.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {project.featured && (
                            <span className="inline-flex items-center gap-1 text-xs bg-[#d4a853]/20 text-[#d4a853] px-2 py-0.5">
                              <Star size={10} />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {project.service_type}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{project.location}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-sm ${
                        project.is_published
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {project.is_published ? (
                        <>
                          <Eye size={14} />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Draft
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="p-2 text-gray-500 hover:text-[#d4a853] transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
