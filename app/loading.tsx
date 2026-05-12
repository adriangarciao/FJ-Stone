import { Skeleton, ProjectCardSkeleton } from '@/components/Skeleton';
import { Section, SectionHeader } from '@/components';

export default function HomeLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="min-h-screen flex flex-col items-center justify-center gap-10 bg-accent px-6 pt-32 pb-20 animate-pulse">
        {/* Slogan line */}
        <div className="h-3 w-32 rounded-full bg-white/20" />

        {/* Headline — two lines */}
        <div className="flex flex-col items-center gap-3 -mt-6">
          <div className="h-10 w-[520px] max-w-full rounded-lg bg-white/20" />
          <div className="h-10 w-[380px] max-w-full rounded-lg bg-white/20" />
        </div>

        {/* Three image cards */}
        <div className="flex items-center justify-center gap-5 w-full max-w-5xl">
          <div className="hidden md:block w-[280px] h-[380px] rounded-xl bg-white/10 flex-shrink-0" />
          <div className="w-[280px] h-[380px] rounded-xl bg-white/10 flex-shrink-0" />
          <div className="hidden md:block w-[280px] h-[380px] rounded-xl bg-white/10 flex-shrink-0" />
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4">
          <div className="h-11 w-36 rounded-md bg-white/20" />
          <div className="h-11 w-36 rounded-md bg-white/20" />
        </div>
      </section>

      {/* Services Section Skeleton */}
      <Section background="white">
        <SectionHeader
          title="Our Services"
          subtitle="Loading our services..."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-6 bg-gray-50">
              <Skeleton className="h-12 w-12 mb-4" />
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </Section>

      {/* Featured Projects Skeleton */}
      <Section background="gray">
        <SectionHeader
          title="Featured Projects"
          subtitle="Loading our recent work..."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </Section>
    </>
  );
}
