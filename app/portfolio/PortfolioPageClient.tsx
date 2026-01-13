'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import { ProjectCard, Section, SectionHeader } from '@/components';
import { useEditModeOptional } from '@/components/admin';
import type { Project } from '@/lib/types';

interface PortfolioPageClientProps {
  projects: Project[];
  filters: string[];
}

export default function PortfolioPageClient({
  projects: initialProjects,
  filters,
}: PortfolioPageClientProps) {
  const router = useRouter();
  const editMode = useEditModeOptional();
  const isEditMode = editMode?.isEditMode ?? false;
  const openProjectEditor = editMode?.openProjectEditor;
  const projectRefreshKey = editMode?.projectRefreshKey ?? 0;

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showUnpublished, setShowUnpublished] = useState(false);

  // Refresh projects when edit mode triggers a refresh
  useEffect(() => {
    if (projectRefreshKey > 0) {
      router.refresh();
    }
  }, [projectRefreshKey, router]);

  // Filter projects based on service type and publish status
  const filteredProjects = projects.filter((p) => {
    const matchesFilter = activeFilter === 'All' || p.service_type === activeFilter;
    const isVisible = p.is_published || (isEditMode && showUnpublished);
    return matchesFilter && isVisible;
  });

  const handleEditProject = useCallback(
    (project: Project) => {
      openProjectEditor?.(project);
    },
    [openProjectEditor]
  );

  const handleNewProject = useCallback(() => {
    openProjectEditor?.(null);
  }, [openProjectEditor]);

  const handleQuickTogglePublish = async (project: Project, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_published: !project.is_published,
        }),
      });

      if (response.ok) {
        // Update local state
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id ? { ...p, is_published: !p.is_published } : p
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-[#292323] pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#292323] to-[#71706e]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
          >
            Our Portfolio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Explore our collection of completed projects and see the quality
            craftsmanship we bring to every job.
          </motion.p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <Section background="white">
        {/* Admin Controls */}
        {isEditMode && (
          <div className="mb-8 p-4 bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleNewProject}
                className="flex items-center gap-2 bg-[#990303] hover:bg-[#71706e] text-white px-4 py-2 font-medium transition-colors"
              >
                <Plus size={18} />
                New Project
              </button>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showUnpublished}
                  onChange={(e) => setShowUnpublished(e.target.checked)}
                  className="w-4 h-4"
                />
                Show unpublished projects
              </label>
            </div>
            <p className="text-sm text-gray-500">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              {showUnpublished && ' (including drafts)'}
            </p>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-[#292323] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative group"
            >
              {/* Admin Overlay */}
              {isEditMode && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {/* Draft Badge */}
                  {!project.is_published && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1">
                      DRAFT
                    </div>
                  )}
                  {/* Edit Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleEditProject(project);
                        }}
                        className="flex items-center gap-1.5 bg-white text-gray-900 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleQuickTogglePublish(project, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
                          project.is_published
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {project.is_published ? (
                          <>
                            <EyeOff size={14} />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye size={14} />
                            Publish
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No projects found for this category.
            </p>
            {isEditMode && (
              <button
                onClick={handleNewProject}
                className="mt-4 inline-flex items-center gap-2 bg-[#990303] hover:bg-[#71706e] text-white px-6 py-3 font-medium transition-colors"
              >
                <Plus size={18} />
                Create Your First Project
              </button>
            )}
          </div>
        )}
      </Section>

      {/* CTA Section */}
      <Section background="gray">
        <div className="text-center">
          <SectionHeader
            title="Like What You See?"
            subtitle="Let us help you create your dream outdoor space. Contact us for a free consultation and estimate."
          />
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.02 }}
            className="inline-block bg-[#990303] hover:bg-[#71706e] text-white border-2 border-white px-10 py-4 font-semibold text-lg transition-colors"
          >
            Start Your Project
          </motion.a>
        </div>
      </Section>
    </>
  );
}

