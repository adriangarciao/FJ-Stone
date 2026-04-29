'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EditableText } from '@/components/admin';
import type { ContentBlock } from '@/lib/types';

const HERO_IMAGES = [
  {
    src: '/images/80AEF9C2-11A9-4C96-9D2C-26A952E84EE3_1_105_c.jpeg',
    alt: 'Residential patio with landscaping',
  },
  {
    src: '/images/5E3D4375-386D-4C1F-AC5F-36319F98C214_1_105_c.jpeg',
    alt: 'Tudor home flagstone walkway',
  },
  {
    src: '/images/73A1BE3C-0FE1-461F-AF66-2AEE21419E70_1_105_c.jpeg',
    alt: 'Residential paver driveway',
  },
];

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
  minHeight = 'min-h-screen',
  contentBlocks = {},
}: HeroProps) {
  const headlineBlock = contentBlocks['home.hero.headline'] || null;
  const subheadlineBlock = contentBlocks['home.hero.subheadline'] || null;
  const taglineBlock = contentBlocks['home.hero.tagline'] || null;

  return (
    <section className={`relative ${minHeight} flex items-center justify-center overflow-hidden`}>

      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#292323] to-[#71706e]" />

      {/* Background portfolio images — decorative, low opacity */}
      <div className="absolute inset-0 flex pointer-events-none" aria-hidden="true">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`relative flex-1 opacity-[0.18] ${i === 1 ? 'block' : 'hidden md:block'}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay for text legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#292323]/60 via-transparent to-[#292323]/60 z-[1]"
        aria-hidden="true"
      />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-5 px-6 max-w-3xl mx-auto">
        <EditableText
          block={taglineBlock}
          fallback="Quality Work, Built to Last"
          as="p"
          className="text-sm uppercase tracking-widest text-white/60"
        />

        <EditableText
          block={headlineBlock}
          fallback={headline}
          as="h1"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
        />

        <EditableText
          block={subheadlineBlock}
          fallback={subheadline}
          as="p"
          className="text-lg text-white/75 max-w-xl"
        />

        {showCTAs && (
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
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
          </div>
        )}
      </div>
    </section>
  );
}
