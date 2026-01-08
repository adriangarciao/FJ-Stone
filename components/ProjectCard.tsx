'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
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
          {/* Placeholder image - replace with actual images */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] flex items-center justify-center">
            <span className="text-white/30 text-sm">Project Image</span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#1a1a2e]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-semibold border-2 border-white px-4 py-2">
              View Project
            </span>
          </div>

          {/* Service Type Tag */}
          <div className="absolute top-4 left-4">
            <span className="bg-[#d4a853] text-[#1a1a2e] text-xs font-semibold px-3 py-1">
              {project.service_type}
            </span>
          </div>
        </motion.div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#d4a853] transition-colors">
            {project.title}
          </h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            {project.location}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
