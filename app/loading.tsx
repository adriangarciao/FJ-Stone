import { Skeleton, ProjectCardSkeleton } from '@/components/Skeleton';
import { Section, SectionHeader } from '@/components';

export default function HomeLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#292323] to-[#71706e]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Logo skeleton */}
            <div className="flex justify-center lg:justify-start">
              <Skeleton className="w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-white/10" />
            </div>
            {/* Text skeleton */}
            <div className="text-center lg:text-left space-y-6">
              <Skeleton className="h-12 w-3/4 bg-white/20" />
              <Skeleton className="h-6 w-full bg-white/10" />
              <Skeleton className="h-6 w-5/6 bg-white/10" />
              <div className="flex gap-4 justify-center lg:justify-start">
                <Skeleton className="h-12 w-36 bg-white/20" />
                <Skeleton className="h-12 w-36 bg-white/20" />
              </div>
            </div>
          </div>
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
