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
  contentBlocks = {},
}: HeroProps) {
  const headlineBlock = contentBlocks['home.hero.headline'] || null;
  const subheadlineBlock = contentBlocks['home.hero.subheadline'] || null;
  const taglineBlock = contentBlocks['home.hero.tagline'] || null;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-10 bg-accent px-6 pt-32 pb-20">

      {/* Text content */}
      <div className="flex flex-col items-center text-center gap-5 max-w-3xl">
        <EditableText
          block={taglineBlock}
          fallback="Quality Work, Built to Last"
          as="p"
          className="text-sm uppercase tracking-widest text-white/60 px-4 py-2"
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
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-accent px-8 py-3.5 font-semibold transition-all"
            >
              See Our Work
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-white text-accent hover:bg-white/90 px-8 py-3.5 font-semibold transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        )}
      </div>

      {/* Three contained portfolio images */}
      <div className="flex items-center justify-center gap-5 w-full max-w-5xl" aria-hidden="true">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`relative rounded-xl overflow-hidden opacity-30 w-[280px] h-[380px] flex-shrink-0 ${
              i === 1 ? 'block' : 'hidden md:block'
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="280px"
            />
          </div>
        ))}
      </div>

    </section>
  );
}
