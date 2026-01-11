'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/admin';
import type { ContentBlock } from '@/lib/types';

interface HeroProps {
  headline: string;
  subheadline: string;
  showCTAs?: boolean;
  logoImage?: string;
  minHeight?: string;
  contentBlocks?: Record<string, ContentBlock>;
}

export default function Hero({
  headline,
  subheadline,
  showCTAs = true,
  logoImage = '/images/fj_logo.png',
  minHeight = 'min-h-screen',
  contentBlocks = {},
}: HeroProps) {
  // Get content blocks or use fallbacks
  const headlineBlock = contentBlocks['home.hero.headline'] || null;
  const subheadlineBlock = contentBlocks['home.hero.subheadline'] || null;
  const taglineBlock = contentBlocks['home.hero.tagline'] || null;

  return (
    <section
      className={`relative ${minHeight} flex items-center overflow-hidden`}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#292323] to-[#71706e]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative w-[550px] h-[550px] sm:w-[550px] sm:h-[550px] lg:w-[950px] lg:h-[950px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoImage}
                alt="F&J's Stone Services Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Right Side - Text and CTAs */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <EditableText
                block={headlineBlock}
                fallback={headline}
                as="h1"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <EditableText
                block={subheadlineBlock}
                fallback={subheadline}
                as="p"
                className="text-lg sm:text-xl text-gray-300 mb-6"
              />
            </motion.div>

            {showCTAs && (
              <>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.55 }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-4"
                >
                  Crafting Outdoor Spaces That Last
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-base sm:text-lg text-gray-300 mb-6"
                >
                  Expert hardscaping, patios, and stonework for residential and commercial properties. Quality craftsmanship built to withstand the test of time.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                >
                  <EditableText
                    block={taglineBlock}
                    fallback="Quality Work, Built to Last"
                    as="p"
                    className="text-xl sm:text-2xl font-semibold text-white mb-8 italic"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
                >
                  <Link
                    href="/portfolio"
                    className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#292323] px-8 py-3.5 font-semibold transition-all"
                  >
                    See Our Work
                  </Link>
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto bg-[#990303] hover:bg-[#71706e] text-white border-2 border-white px-8 py-3.5 font-semibold transition-colors"
                  >
                    Request a Quote
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showCTAs && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}

