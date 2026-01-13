import { PortfolioGridSkeleton, FilterButtonsSkeleton, Skeleton } from '@/components/Skeleton';
import { Section } from '@/components';

export default function PortfolioLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-[#292323] pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#292323] to-[#71706e]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <Skeleton className="h-12 w-64 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-6 w-96 max-w-full mx-auto bg-white/10" />
        </div>
      </section>

      {/* Portfolio Grid Skeleton */}
      <Section background="white">
        <FilterButtonsSkeleton />
        <PortfolioGridSkeleton count={6} />
      </Section>
    </>
  );
}
