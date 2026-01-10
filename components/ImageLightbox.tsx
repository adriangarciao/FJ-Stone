'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type LightboxImage = {
  src: string;
  alt?: string;
  caption?: string;
};

interface ImageLightboxProps {
  isOpen: boolean;
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}

function normalizeIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export default function ImageLightbox({
  isOpen,
  images,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!isOpen) return;
    setIndex(normalizeIndex(initialIndex, images.length));
  }, [isOpen, initialIndex, images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (!hasMultipleImages) return;
      if (event.key === 'ArrowRight') {
        setIndex((prev) => (prev + 1) % images.length);
      } else if (event.key === 'ArrowLeft') {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, images.length, hasMultipleImages]);

  if (!isOpen || images.length === 0 || typeof document === 'undefined') {
    return null;
  }

  const currentImage = images[index];

  return createPortal(
    <div
      className="fixed inset-0"
      style={{ zIndex: 99999, isolation: 'isolate' }}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)', zIndex: 1 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        type="button"
        aria-label="Close lightbox"
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        style={{ zIndex: 10 }}
      >
        <X size={28} className="text-white" />
      </button>

      {/* Navigation arrows - positioned outside the image container */}
      {hasMultipleImages && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((prev) => (prev - 1 + images.length) % images.length);
          }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{ zIndex: 10 }}
          aria-label="Previous image"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
      )}
      {hasMultipleImages && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIndex((prev) => (prev + 1) % images.length);
          }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{ zIndex: 10 }}
          aria-label="Next image"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      )}

      {/* Image container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-16 md:p-20 pointer-events-none"
        style={{ zIndex: 5 }}
      >
        <div className="flex flex-col items-center justify-center max-w-full max-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage.src}
            alt={currentImage.alt || 'Image'}
            className="block max-w-full max-h-[80vh] w-auto h-auto object-contain select-none pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          />
          {currentImage.caption && (
            <p className="mt-4 text-center text-sm text-white/80 max-w-xl pointer-events-none">
              {currentImage.caption}
            </p>
          )}
          {hasMultipleImages && (
            <p className="mt-2 text-center text-xs text-white/60 pointer-events-none">
              {index + 1} / {images.length}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
