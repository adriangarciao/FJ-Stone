'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Grid3X3,
  Layers,
  MoveHorizontal,
  Car,
  Flame,
  Sparkles,
} from 'lucide-react';
import { Service } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'grid-3x3': Grid3X3,
  'layers': Layers,
  'move-horizontal': MoveHorizontal,
  'car': Car,
  'flame': Flame,
  'flame-kindling': Sparkles,
};

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Grid3X3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white border border-gray-200 p-8 group hover:shadow-xl transition-shadow"
    >
      <div className="w-14 h-14 bg-[#990303]/10 flex items-center justify-center mb-6 group-hover:bg-[#990303]/20 transition-colors">
        <Icon size={28} className="text-[#990303]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
      <ul className="space-y-2 mb-6">
        {service.features.slice(0, 3).map((feature, i) => (
          <li key={i} className="flex items-center text-sm text-gray-600">
            <span className="w-1.5 h-1.5 bg-[#990303] rounded-full mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className="inline-flex items-center text-[#990303] font-semibold hover:text-[#71706e] transition-colors"
      >
        Get a Quote
        <svg
          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </motion.div>
  );
}

