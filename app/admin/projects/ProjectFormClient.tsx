'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Upload, Trash2, X } from 'lucide-react';
import { createProject, updateProject, uploadProjectImage, deleteProjectImage } from '@/app/actions/admin';
import { getProjectImageUrl } from '@/lib/supabase/storage';
import { serviceTypes } from '@/lib/dummy-data';
import type { Project } from '@/lib/types';

interface ProjectFormClientProps {
  project?: Project;
}

export default function ProjectFormClient({ project }: ProjectFormClientProps) {
  const router = useRouter();
  const isEditing = !!project;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const result = isEditing
      ? await updateProject(project.id, formData)
      : await createProject(formData);

    setIsSubmitting(false);

    if (result.success) {
      router.push('/admin/projects');
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!project || !e.target.files?.length) return;

    setUploadingImage(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', '');
    formData.append('sort_order', String(project.images?.length || 0));

    const result = await uploadProjectImage(project.id, formData);
    setUploadingImage(false);

    if (!result.success) {
      setError(result.error || 'Failed to upload image');
    }

    // Reset input
    e.target.value = '';
  };

  const handleDeleteImage = async (imageId: string, storagePath: string) => {
    if (!confirm('Delete this image?')) return;

    const result = await deleteProjectImage(imageId, storagePath);
    if (!result.success) {
      setError(result.error || 'Failed to delete image');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <>
      <Link
        href="/admin/projects"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Projects
      </Link>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3">
          <X size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={project?.title}
                  required
                  onChange={(e) => {
                    if (!isEditing) {
                      const slugInput = document.getElementById('slug') as HTMLInputElement;
                      if (slugInput) {
                        slugInput.value = generateSlug(e.target.value);
                      }
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#990303]"
                  placeholder="Project title"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  defaultValue={project?.slug}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#990303]"
                  placeholder="project-url-slug"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    defaultValue={project?.service_type}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#990303] bg-white"
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.filter(t => t !== 'Other').map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={project?.location}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#990303]"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={project?.description}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#990303] resize-none"
                  placeholder="Project description..."
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    value="true"
                    defaultChecked={project?.featured}
                    className="w-4 h-4 text-[#990303] focus:ring-[#990303]"
                  />
                  <span className="text-sm text-gray-700">Featured project</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    value="true"
                    defaultChecked={project?.is_published ?? true}
                    className="w-4 h-4 text-[#990303] focus:ring-[#990303]"
                  />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#990303] hover:bg-[#71706e] disabled:bg-gray-400 text-white border-2 border-white px-6 py-3 font-semibold flex items-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-[#292323] border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {isEditing ? 'Update Project' : 'Create Project'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Images Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Images</h3>

            {!isEditing ? (
              <p className="text-gray-500 text-sm">
                Save the project first, then you can add images.
              </p>
            ) : (
              <>
                {/* Upload Button */}
                <div className="mb-4">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <span className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#990303] p-6 cursor-pointer transition-colors">
                      {uploadingImage ? (
                        <>
                          <span className="animate-spin w-5 h-5 border-2 border-[#990303] border-t-transparent rounded-full" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={20} className="text-gray-400" />
                          <span className="text-gray-600 text-sm">Upload Image</span>
                        </>
                      )}
                    </span>
                  </label>
                </div>

                {/* Image List */}
                <div className="space-y-3">
                  {project.images?.map((image) => {
                    const imageUrl = getProjectImageUrl(image.storage_path);
                    return (
                      <div
                        key={image.id}
                        className="relative group border border-gray-200"
                      >
                        <div className="relative aspect-video bg-gray-100">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={image.caption || 'Project image'}
                              fill
                              className="object-cover"
                              sizes="300px"
                            />
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteImage(image.id, image.storage_path)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete image"
                        >
                          <Trash2 size={14} />
                        </button>
                        {image.caption && (
                          <p className="text-xs text-gray-500 p-2">{image.caption}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {(!project.images || project.images.length === 0) && (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No images yet
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

