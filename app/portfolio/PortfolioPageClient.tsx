'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard, Section, SectionHeader } from '@/components';
import type { Project } from '@/lib/types';

interface PortfolioPageClientProps {
  projects: Project[];
  filters: string[];
}

export default function PortfolioPageClient({
  projects,
  filters,
}: PortfolioPageClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.service_type === activeFilter);

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
            >
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

