'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Section, ImageLightbox } from '@/components';
import { getProjectImageUrl } from '@/lib/supabase/storage';
import type { Project } from '@/lib/types';

interface ProjectDetailClientProps {
  project: Project;
  relatedProjects: Project[];
}

export default function ProjectDetailClient({
  project,
  relatedProjects,
}: ProjectDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  const images = project.images || [];
  const hasMultipleImages = images.length > 1;

  const openLightbox = useCallback((index: number) => {
    setLightboxInitialIndex(index);
    setLightboxOpen(true);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const currentImage = images[currentImageIndex];
  const currentImageUrl = currentImage
    ? getProjectImageUrl(currentImage.storage_path)
    : null;
  const lightboxImages = images.map((image) => ({
    src: getProjectImageUrl(image.storage_path),
    alt: image.caption || project.title,
    caption: image.caption || undefined,
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-end bg-[#292323] pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#292323] to-[#71706e]" />
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Link
                href="/portfolio"
                className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back to Portfolio
              </Link>
              <div className="mt-4">
                <span className="inline-block bg-[#990303] text-white border-2 border-white text-sm font-semibold px-3 py-1 mb-4">
                  {project.service_type}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <Section background="white">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Main Image / Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="relative aspect-[4/3] bg-gradient-to-br from-[#292323] to-[#71706e] flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => {
                if (images.length > 0) {
                  openLightbox(currentImageIndex);
                }
              }}
            >
              {currentImageUrl ? (
                <Image
                  src={currentImageUrl}
                  alt={currentImage?.caption || project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <span className="text-white/30 text-sm">
                  {images[currentImageIndex]?.caption || 'Project Image'}
                </span>
              )}

              {/* Navigation Arrows */}
              {!lightboxOpen && hasMultipleImages && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} className="text-[#292323]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white flex items-center justify-center transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} className="text-[#292323]" />
                  </button>
                </>
              )}
            </div>

            {/* Image Dots */}
            {!lightboxOpen && hasMultipleImages && (
              <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-[#990303]' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Caption */}
            {!lightboxOpen && currentImage?.caption && (
              <p className="text-center text-gray-500 text-sm mt-2">
                {currentImage.caption}
              </p>
            )}

          </motion.div>

          {/* Project Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Project Details
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {project.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-500">Service Type</span>
                <span className="font-semibold text-gray-900">
                  {project.service_type}
                </span>
              </div>
              {images.length > 0 && (
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-500">Photos</span>
                  <span className="font-semibold text-gray-900">
                    {images.length} {images.length === 1 ? 'image' : 'images'}
                  </span>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="inline-block bg-[#990303] hover:bg-[#71706e] text-white border-2 border-white px-8 py-3.5 font-semibold transition-colors"
            >
              Request a Similar Project
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <Section background="gray">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            More Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProjects.map((relatedProject) => {
              const imageUrl = relatedProject.images?.[0]
                ? getProjectImageUrl(relatedProject.images[0].storage_path)
                : null;

              return (
                <Link
                  key={relatedProject.id}
                  href={`/portfolio/${relatedProject.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#292323] to-[#71706e] flex items-center justify-center overflow-hidden mb-4">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={relatedProject.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <span className="text-white/30 text-sm">Project Image</span>
                    )}
                    <div className="absolute inset-0 bg-[#292323]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold border-2 border-white px-4 py-2">
                        View Project
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#990303] text-white border-2 border-white text-xs font-semibold px-3 py-1">
                        {relatedProject.service_type}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-[#990303] transition-colors">
                    {relatedProject.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxInitialIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
