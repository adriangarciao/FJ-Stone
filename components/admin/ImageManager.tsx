'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Loader2,
  ImageIcon,
  Save,
} from 'lucide-react';
import { getProjectImageUrl } from '@/lib/supabase/storage';
import type { Project, ProjectImage } from '@/lib/types';

interface ImageManagerProps {
  project: Project;
  onImagesUpdated: (project: Project) => void;
}

interface ImageEditState {
  caption: string;
  alt: string;
  hasChanges: boolean;
}

export function ImageManager({ project, onImagesUpdated }: ImageManagerProps) {
  const [images, setImages] = useState<ProjectImage[]>(project.images || []);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [editStates, setEditStates] = useState<Record<string, ImageEditState>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize edit states for images
  const getEditState = (image: ProjectImage): ImageEditState => {
    if (editStates[image.id]) {
      return editStates[image.id];
    }
    return {
      caption: image.caption || '',
      alt: image.alt || '',
      hasChanges: false,
    };
  };

  const updateEditState = (imageId: string, field: 'caption' | 'alt', value: string) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    const currentState = getEditState(image);
    const originalCaption = image.caption || '';
    const originalAlt = image.alt || '';

    const newCaption = field === 'caption' ? value : currentState.caption;
    const newAlt = field === 'alt' ? value : currentState.alt;

    setEditStates((prev) => ({
      ...prev,
      [imageId]: {
        caption: newCaption,
        alt: newAlt,
        hasChanges: newCaption !== originalCaption || newAlt !== originalAlt,
      },
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
    setUploadProgress(`Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await fetch(`/api/admin/projects/${project.id}/upload-images`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload images');
      }

      // Add new images to the list
      const newImages = [...images, ...(result.images || [])];
      setImages(newImages);

      // Update parent
      onImagesUpdated({ ...project, images: newImages });

      if (result.errors && result.errors.length > 0) {
        setError(result.errors.join('; '));
      } else {
        setSuccessMessage(`Uploaded ${result.images?.length || 0} image${result.images?.length !== 1 ? 's' : ''}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (image: ProjectImage) => {
    const confirmed = window.confirm('Delete this image? This cannot be undone.');
    if (!confirmed) return;

    setDeletingIds((prev) => new Set(prev).add(image.id));
    setError(null);

    try {
      const response = await fetch(`/api/admin/project-images/${image.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete image');
      }

      // Remove from local state
      const newImages = images.filter((img) => img.id !== image.id);
      setImages(newImages);

      // Update parent
      onImagesUpdated({ ...project, images: newImages });

      setSuccessMessage('Image deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(image.id);
        return next;
      });
    }
  };

  const handleSaveImageDetails = async (image: ProjectImage) => {
    const editState = getEditState(image);
    if (!editState.hasChanges) return;

    setSavingIds((prev) => new Set(prev).add(image.id));
    setError(null);

    try {
      const response = await fetch(`/api/admin/project-images/${image.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: editState.caption || null,
          alt: editState.alt || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save image details');
      }

      // Update local state
      const newImages = images.map((img) =>
        img.id === image.id
          ? { ...img, caption: editState.caption || null, alt: editState.alt || null }
          : img
      );
      setImages(newImages);

      // Clear edit state
      setEditStates((prev) => {
        const next = { ...prev };
        delete next[image.id];
        return next;
      });

      // Update parent
      onImagesUpdated({ ...project, images: newImages });

      setSuccessMessage('Image details saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(image.id);
        return next;
      });
    }
  };

  const handleMoveImage = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;

    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    // Update local state immediately for responsiveness
    setImages(newImages);

    // Save new order to server
    try {
      const response = await fetch(`/api/admin/projects/${project.id}/reorder-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderedImageIds: newImages.map((img) => img.id),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to reorder images');
      }

      // Update parent
      onImagesUpdated({ ...project, images: newImages });
    } catch (err) {
      // Revert on error
      setImages(images);
      setError(err instanceof Error ? err.message : 'Failed to reorder');
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Visual feedback could be added here
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    await handleMoveImage(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const clearMessages = useCallback(() => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage(null);
    }, 3000);
  }, []);

  // Auto-clear messages
  if (successMessage) {
    clearMessages();
  }

  return (
    <div className="space-y-4">
      {/* Messages */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {/* Upload Area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-[#990303] p-6 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 size={24} className="text-[#990303] animate-spin" />
              <span className="text-gray-600 text-sm">{uploadProgress}</span>
            </>
          ) : (
            <>
              <Upload size={24} className="text-gray-400" />
              <span className="text-gray-600 text-sm">
                Click to upload images
              </span>
              <span className="text-gray-400 text-xs">
                JPEG, PNG, or WebP (max 5MB each, up to 10 files)
              </span>
            </>
          )}
        </button>
      </div>

      {/* Images List */}
      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
          <p>No images yet</p>
          <p className="text-sm">Upload images to showcase this project</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            {images.length} image{images.length !== 1 ? 's' : ''} - Drag to reorder
          </p>

          {images.map((image, index) => {
            const imageUrl = getProjectImageUrl(image.storage_path);
            const editState = getEditState(image);
            const isDeleting = deletingIds.has(image.id);
            const isSaving = savingIds.has(image.id);
            const isDragging = draggedIndex === index;

            return (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white border border-gray-200 transition-all ${
                  isDragging ? 'opacity-50 scale-95' : ''
                } ${isDeleting ? 'opacity-50' : ''}`}
              >
                <div className="flex gap-3 p-3">
                  {/* Drag Handle */}
                  <div className="flex flex-col items-center justify-center cursor-grab active:cursor-grabbing">
                    <GripVertical size={18} className="text-gray-400" />
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={editState.alt || image.caption || 'Project image'}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Caption
                      </label>
                      <input
                        type="text"
                        value={editState.caption}
                        onChange={(e) => updateEditState(image.id, 'caption', e.target.value)}
                        maxLength={140}
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 focus:outline-none focus:border-[#990303]"
                        placeholder="Image caption"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={editState.alt}
                        onChange={(e) => updateEditState(image.id, 'alt', e.target.value)}
                        maxLength={140}
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 focus:outline-none focus:border-[#990303]"
                        placeholder="Describe the image for accessibility"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-between items-end">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveImage(index, index - 1)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveImage(index, index + 1)}
                        disabled={index === images.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Save & Delete */}
                    <div className="flex items-center gap-1">
                      {editState.hasChanges && (
                        <button
                          onClick={() => handleSaveImageDetails(image)}
                          disabled={isSaving}
                          className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                          title="Save changes"
                        >
                          {isSaving ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Save size={16} />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteImage(image)}
                        disabled={isDeleting}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Delete image"
                      >
                        {isDeleting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
