'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Grid3X3,
  Layers,
  MoveHorizontal,
  Car,
  Flame,
  Sparkles,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Section } from '@/components';
import { EditableText } from '@/components/admin';
import { services } from '@/lib/dummy-data';
import type { ContentBlock } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'grid-3x3': Grid3X3,
  'layers': Layers,
  'move-horizontal': MoveHorizontal,
  'car': Car,
  'flame': Flame,
  'flame-kindling': Sparkles,
};

// Map service titles to portfolio images
const serviceImages: Record<string, { src: string; position?: string }> = {
  'Patio Installation': { src: '/images/158AC9A7-D459-4A8D-8D0A-7236EBF09AB8_1_105_c.jpeg' },
  'Retaining Walls': { src: '/images/7AFB6119-69B5-442B-8612-EA9ADE730550_4_5005_c.jpeg' },
  'Walkways & Paths': { src: '/images/5E3D4375-386D-4C1F-AC5F-36319F98C214_1_105_c.jpeg' },
  'Driveways': { src: '/images/73A1BE3C-0FE1-461F-AF66-2AEE21419E70_1_105_c.jpeg' },
  'Outdoor Kitchens': { src: '/images/9DF216A3-CFE2-4925-99B6-9D515C92B6F0_1_105_c.jpeg' },
  'Fire Features': { src: '/images/0834B227-14FC-4BBC-8EA1-FFA883885AA5_1_105_c.jpeg' },
};

// Map service IDs to content block key prefixes
const serviceKeyMap: Record<string, string> = {
  '1': 'patio',
  '2': 'retaining-walls',
  '3': 'walkways',
  '4': 'driveways',
  '5': 'outdoor-kitchens',
  '6': 'fire-features',
};

interface ServicesPageClientProps {
  contentBlocks: Record<string, ContentBlock>;
}

export default function ServicesPageClient({ contentBlocks }: ServicesPageClientProps) {
  // Hero section content blocks
  const heroHeadlineBlock = contentBlocks['services.hero.headline'] || null;
  const heroSubheadlineBlock = contentBlocks['services.hero.subheadline'] || null;

  // CTA section content blocks
  const ctaHeadlineBlock = contentBlocks['services.cta.headline'] || null;
  const ctaSubheadlineBlock = contentBlocks['services.cta.subheadline'] || null;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-[#292323] pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#292323] to-[#71706e]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EditableText
              block={heroHeadlineBlock}
              fallback="Our Services"
              as="h1"
              className="text-4xl sm:text-5xl font-bold text-white mb-6"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <EditableText
              block={heroSubheadlineBlock}
              fallback="From concept to completion, we offer comprehensive hardscaping services to transform your outdoor space into something extraordinary."
              as="p"
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      {services.map((service, index) => {
        const Icon = iconMap[service.icon] || Grid3X3;
        const isEven = index % 2 === 0;
        const serviceKey = serviceKeyMap[service.id] || service.id;

        // Get content blocks for this service
        const titleBlock = contentBlocks[`services.${serviceKey}.title`] || null;
        const descriptionBlock = contentBlocks[`services.${serviceKey}.description`] || null;

        return (
          <Section
            key={service.id}
            background={isEven ? 'white' : 'gray'}
            id={service.title.toLowerCase().replace(/\s+/g, '-')}
          >
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={isEven ? '' : 'lg:order-2'}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#990303]/10 flex items-center justify-center">
                    <Icon size={28} className="text-[#990303]" />
                  </div>
                  <EditableText
                    block={titleBlock}
                    fallback={service.title}
                    as="h2"
                    className="text-3xl font-bold text-gray-900"
                  />
                </div>
                <EditableText
                  block={descriptionBlock}
                  fallback={service.description}
                  as="p"
                  className="text-gray-600 text-lg mb-6 leading-relaxed"
                />
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => {
                    const featureBlock = contentBlocks[`services.${serviceKey}.feature${i + 1}`] || null;
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-[#990303] flex items-center justify-center flex-shrink-0">
                          <Check size={14} className="text-white" />
                        </div>
                        <EditableText
                          block={featureBlock}
                          fallback={feature}
                          as="span"
                          className="text-gray-700"
                        />
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex items-center bg-[#990303] hover:bg-[#71706e] text-white border-2 border-white px-6 py-3 font-semibold transition-colors"
                >
                  Request a Quote
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`relative aspect-[4/3] bg-gradient-to-br from-[#292323] to-[#71706e] overflow-hidden ${isEven ? '' : 'lg:order-1'}`}
              >
                <Image
                  src={serviceImages[service.title]?.src || '/images/placeholder.jpg'}
                  alt={service.title}
                  fill
                  className={`object-cover ${serviceImages[service.title]?.position || ''}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </div>
          </Section>
        );
      })}

      {/* CTA Section */}
      <Section background="dark">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <EditableText
              block={ctaHeadlineBlock}
              fallback="Ready to Start Your Project?"
              as="h2"
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <EditableText
              block={ctaSubheadlineBlock}
              fallback="Contact us today for a free consultation. We'll help you choose the right services for your property and budget."
              as="p"
              className="text-gray-300 text-lg max-w-2xl mx-auto mb-8"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-[#990303] hover:bg-[#71706e] text-white border-2 border-white px-8 py-3.5 font-semibold transition-colors"
            >
              Get Your Free Quote
            </Link>
            <Link
              href="/portfolio"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#292323] px-8 py-3.5 font-semibold transition-all"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
