'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  // Get the first image from the project, or use a placeholder
  const firstImage = project.images?.[0];
  const imageSrc = firstImage?.storage_path || '/images/placeholder.jpg';
  const imageAlt = firstImage?.caption || project.title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/portfolio/${project.slug}`} className="block group">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden bg-gray-200 aspect-[4/3]"
        >
          {/* Project Image */}
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

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
        </motion.div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#990303] transition-colors">
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
