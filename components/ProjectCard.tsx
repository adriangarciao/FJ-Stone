'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { getProjectImageUrl } from '@/lib/supabase/storage';
import { usePreloadedLazyLoad } from '@/hooks/usePreloadedLazyLoad';
import Reveal from './Reveal';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const firstImage = project.images?.[0];
  const imageSrc = getProjectImageUrl(firstImage?.storage_path || '') || '/images/placeholder.jpg';
  const imageAlt = firstImage?.alt || firstImage?.caption || project.title;
  const blurDataURL = firstImage?.blur_data_url;

  const [isLoaded, setIsLoaded] = useState(false);

  // Eager-load the first 6 cards; preload the rest 800px before viewport
  const isEager = index < 6;
  const { ref, isInView } = usePreloadedLazyLoad<HTMLDivElement>({
    rootMargin: '800px 0px',
    skip: isEager,
  });

  return (
    <Reveal delay={index * 0.1}>
      <Link href={`/portfolio/${project.slug}`} className="block group">
        <div
          ref={ref}
          className="relative overflow-hidden bg-gray-200 aspect-[4/3] transition-transform duration-200 hover:scale-[1.02]"
        >
          {/* Blur placeholder — always visible until full image loads */}
          {blurDataURL && (
            <div
              className={`absolute inset-0 bg-cover bg-center scale-110 blur-xl transition-opacity duration-500 ${
                isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              style={{ backgroundImage: `url(${blurDataURL})` }}
              aria-hidden="true"
            />
          )}

          {/* Full image — renders once preloaded or eagerly for first 6 */}
          {isInView && (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority={index < 3}
              onLoad={() => setIsLoaded(true)}
              className={`object-cover transition-[opacity,transform] duration-300 group-hover:scale-105 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#292323]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-semibold border-2 border-white px-4 py-2">
              View Project
            </span>
          </div>

          {/* Service Type Tag */}
          <div className="absolute top-4 left-4">
            <span className="bg-[#990303] text-white border-2 border-white text-xs font-semibold px-3 py-1">
              {project.service_type}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#990303] transition-colors">
            {project.title}
          </h3>
        </div>
      </Link>
    </Reveal>
  );
}
