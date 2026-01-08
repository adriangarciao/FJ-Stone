'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeroProps {
  headline: string;
  subheadline: string;
  showCTAs?: boolean;
  backgroundImage?: string;
  minHeight?: string;
}

export default function Hero({
  headline,
  subheadline,
  showCTAs = true,
  backgroundImage = '/images/hero-bg.jpg',
  minHeight = 'min-h-screen',
}: HeroProps) {
  return (
    <section
      className={`relative ${minHeight} flex items-center justify-center overflow-hidden`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#1a1a2e]/75" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
        >
          {headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
        >
          {subheadline}
        </motion.p>

        {showCTAs && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/portfolio"
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1a1a2e] px-8 py-3.5 font-semibold transition-all"
            >
              See Our Work
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-[#d4a853] hover:bg-[#c49943] text-[#1a1a2e] px-8 py-3.5 font-semibold transition-colors"
            >
              Request a Quote
            </Link>
          </motion.div>
        )}
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
