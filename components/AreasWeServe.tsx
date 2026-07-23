import Link from 'next/link';
import Section, { SectionHeader } from './Section';
import { serviceAreas } from '@/lib/serviceAreas';

/**
 * Areas We Serve — static, server-rendered local-SEO section. Town names ship as
 * plain HTML in the initial response (no client fetching), so search crawlers
 * index the full service area.
 */
export default function AreasWeServe() {
  return (
    <Section background="gray" id="areas-we-serve">
      <SectionHeader
        title="Areas We Serve"
        subtitle="F&J's Stone Services designs and builds patios, retaining walls, walkways, and outdoor living spaces throughout Chicago's North Shore and surrounding communities. Explore our service area below, and if you don't see your town, reach out anyway."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {serviceAreas.map((area) => (
          <div
            key={area.region}
            className="p-6 border border-gray-200 bg-white"
          >
            <h3 className="font-bold mb-3 text-lg text-gray-900">
              {area.region}
              {area.note && (
                <span className="block text-sm font-semibold text-[#990303] mt-1">
                  {area.note}
                </span>
              )}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {area.towns.join(', ')}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-600 mt-12">
        Not sure if we cover your area?{' '}
        <Link
          href="/contact"
          className="font-semibold text-[#990303] hover:underline"
        >
          Get in touch
        </Link>{' '}
        for a free consultation.
      </p>
    </Section>
  );
}
