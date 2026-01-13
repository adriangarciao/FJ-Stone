'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Save, Loader2, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { useEditMode } from './EditModeContext';
import { ImageManager } from './ImageManager';
import { serviceTypes } from '@/lib/dummy-data';
import type { Project } from '@/lib/types';

export default function ProjectEditorDrawer() {
  const {
    activeProject,
    isCreatingProject,
    closeProjectEditor,
    refreshProjectData,
  } = useEditMode();

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'images'>('details');

  // Current project state (for image manager)
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Initialize form when project changes
  useEffect(() => {
    if (activeProject) {
      setTitle(activeProject.title);
      setSlug(activeProject.slug);
      setServiceType(activeProject.service_type);
      setDescription(activeProject.description);
      setLocation(activeProject.location || '');
      setFeatured(activeProject.featured);
      setIsPublished(activeProject.is_published);
      setCurrentProject(activeProject);
      setHasChanges(false);
      setError(null);
      setSuccessMessage(null);
      setActiveTab('details');
    } else if (isCreatingProject) {
      setTitle('');
      setSlug('');
      setServiceType('');
      setDescription('');
      setLocation('');
      setFeatured(false);
      setIsPublished(false);
      setCurrentProject(null);
      setHasChanges(false);
      setError(null);
      setSuccessMessage(null);
      setActiveTab('details');
    }
  }, [activeProject, isCreatingProject]);

  // Track changes
  useEffect(() => {
    if (activeProject) {
      const changed =
        title !== activeProject.title ||
        slug !== activeProject.slug ||
        serviceType !== activeProject.service_type ||
        description !== activeProject.description ||
        location !== (activeProject.location || '') ||
        featured !== activeProject.featured ||
        isPublished !== activeProject.is_published;
      setHasChanges(changed);
    } else if (isCreatingProject) {
      setHasChanges(title.length > 0 || description.length > 0);
    }
  }, [
    title,
    slug,
    serviceType,
    description,
    location,
    featured,
    isPublished,
    activeProject,
    isCreatingProject,
  ]);

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100);
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    // Auto-generate slug for new projects
    if (isCreatingProject) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isCreatingProject) {
        // Create new project
        const response = await fetch('/api/admin/projects/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            service_type: serviceType,
            description,
            location,
            featured,
            is_published: isPublished,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create project');
        }

        // Update current project for image management
        setCurrentProject(result.project);
        setSlug(result.project.slug);
        setSuccessMessage('Project created! You can now add images.');
        refreshProjectData();
      } else if (activeProject) {
        // Update existing project
        const response = await fetch(`/api/admin/projects/${activeProject.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug,
            service_type: serviceType,
            description,
            location,
            featured,
            is_published: isPublished,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update project');
        }

        setSuccessMessage('Project updated successfully');
        refreshProjectData();
      }

      setHasChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeProject) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${activeProject.title}"? This will also delete all associated images.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/projects/${activeProject.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete project');
      }

      refreshProjectData();
      closeProjectEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!activeProject && !currentProject) return;

    const projectId = activeProject?.id || currentProject?.id;
    if (!projectId) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_published: !isPublished,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update publish status');
      }

      setIsPublished(!isPublished);
      setSuccessMessage(isPublished ? 'Project unpublished' : 'Project published');
      refreshProjectData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmed) return;
    }
    closeProjectEditor();
  };

  const handleImagesUpdated = useCallback((project: Project) => {
    setCurrentProject(project);
  }, []);

  // Don't render if not editing
  if (!activeProject && !isCreatingProject) return null;

  const projectForImages = currentProject || activeProject;
  const canManageImages = !!projectForImages?.id;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {isCreatingProject && !currentProject
                ? 'New Project'
                : 'Edit Project'}
            </h2>
            {projectForImages && (
              <span
                className={`text-xs px-2 py-0.5 font-medium ${
                  isPublished
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {isPublished ? 'Published' : 'Draft'}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-[#990303] border-b-2 border-[#990303]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('images')}
            disabled={!canManageImages}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'images'
                ? 'text-[#990303] border-b-2 border-[#990303]'
                : 'text-gray-500 hover:text-gray-700'
            } ${!canManageImages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Images {projectForImages?.images?.length ? `(${projectForImages.images.length})` : ''}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {activeTab === 'details' ? (
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  maxLength={80}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#990303]"
                  placeholder="Project title"
                />
                <p className="text-xs text-gray-400 mt-1">{title.length}/80</p>
              </div>

              {/* Slug (only show for existing projects) */}
              {!isCreatingProject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    maxLength={100}
                    className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#990303] font-mono text-sm"
                    placeholder="project-url-slug"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    /portfolio/{slug || 'project-slug'}
                  </p>
                </div>
              )}

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#990303] bg-white"
                >
                  <option value="">Select service type</option>
                  {serviceTypes
                    .filter((t) => t !== 'Other')
                    .map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={120}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#990303]"
                  placeholder="City, State"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={4000}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 focus:outline-none focus:border-[#990303] resize-none"
                  placeholder="Describe the project..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  {description.length}/4000
                </p>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#990303] focus:ring-[#990303]"
                  />
                  <Star
                    size={16}
                    className={featured ? 'text-yellow-500' : 'text-gray-400'}
                  />
                  <span className="text-sm text-gray-700">Featured project</span>
                </label>
              </div>

              {/* Delete Button (only for existing projects) */}
              {activeProject && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete Project
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Images Tab */
            <ImageManager
              project={projectForImages!}
              onImagesUpdated={handleImagesUpdated}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {canManageImages && (
              <button
                onClick={handleTogglePublish}
                disabled={isSaving}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                  isPublished
                    ? 'text-yellow-700 hover:text-yellow-800'
                    : 'text-green-700 hover:text-green-800'
                }`}
              >
                {isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                {isPublished ? 'Unpublish' : 'Publish'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || (!hasChanges && !isCreatingProject)}
              className="px-6 py-2 bg-[#990303] hover:bg-[#71706e] disabled:bg-gray-300 text-white font-medium transition-colors flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isCreatingProject && !currentProject ? 'Create' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
