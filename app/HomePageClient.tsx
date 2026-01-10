'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import {
  Hero,
  Section,
  SectionHeader,
  ServiceCard,
  ProjectCard,
  ReviewCard,
} from '@/components';
import type { SiteSettings, Project, Review, Service } from '@/lib/types';

const whyChooseUs = [
  'Over 15 years of industry experience',
  'Licensed, bonded, and fully insured',
  'Premium materials and expert craftsmanship',
  'Transparent pricing with no hidden fees',
  'On-time project completion guarantee',
  'Comprehensive warranty on all work',
];

interface HomePageClientProps {
  siteSettings: SiteSettings;
  featuredProjects: Project[];
  featuredReviews: Review[];
  featuredServices: Service[];
}

export default function HomePageClient({
  siteSettings,
  featuredProjects,
  featuredReviews,
  featuredServices,
}: HomePageClientProps) {
  return (
    <>
      {/* Hero Section */}
      <Hero
        headline={siteSettings.hero_headline}
        subheadline={siteSettings.hero_subheadline}
        showCTAs={true}
        logoImage="/images/fj_logo.png"
      />

      {/* Services Section */}
      <Section background="gray" id="services">
        <SectionHeader
          title="What We Do"
          subtitle="From elegant patios to sturdy retaining walls, we deliver exceptional hardscaping solutions tailored to your vision."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center text-[#292323] font-semibold hover:text-[#990303] transition-colors"
          >
            View All Services
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <Section background="white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeader
              title="Why Choose F&J's Stone Services"
              subtitle="We combine traditional craftsmanship with modern techniques to deliver outdoor spaces that exceed expectations."
              centered={false}
            />
            <ul className="space-y-4">
              {whyChooseUs.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 bg-[#990303] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={16} className="text-white" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] bg-gradient-to-br from-[#292323] to-[#71706e] flex items-center justify-center p-8"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fj_logo.png"
              alt="F&J's Stone Services Logo"
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        </div>
      </Section>

      {/* Featured Projects Section */}
      <Section background="gray" id="portfolio">
        <SectionHeader
          title="Featured Projects"
          subtitle="Explore some of our recent work and see the quality craftsmanship we bring to every project."
        />
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProjects.slice(0, 4).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Projects coming soon. Check back later!
          </p>
        )}
        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className="inline-flex items-center bg-[#292323] hover:bg-[#71706e] text-white px-8 py-3 font-semibold transition-colors"
          >
            View All Projects
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </Section>

      {/* Reviews Section */}
      <Section background="white" id="reviews">
        <SectionHeader
          title="What Our Clients Say"
          subtitle="Don't just take our word for it. Here's what homeowners have to say about working with us."
        />
        {featuredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredReviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Reviews coming soon. Check back later!
          </p>
        )}
      </Section>

      {/* CTA Section */}
      <Section background="dark">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Ready to Transform Your Outdoor Space?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-300 text-lg max-w-2xl mx-auto mb-8"
          >
            Contact us today for a free consultation and estimate. Let&apos;s bring your
            vision to life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link
              href="/contact"
              className="inline-block bg-[#990303] hover:bg-[#71706e] text-white border-2 border-white px-10 py-4 font-semibold text-lg transition-colors"
            >
              Get Your Free Quote
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  );
}

