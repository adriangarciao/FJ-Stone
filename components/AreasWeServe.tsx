import Link from 'next/link';
import Section, { SectionHeader } from './Section';

interface ServiceArea {
  region: string;
  /** Optional qualifier shown next to the region label (e.g. the primary area). */
  note?: string;
  towns: string;
  primary?: boolean;
}

const serviceAreas: ServiceArea[] = [
  {
    region: 'North Shore',
    note: 'Primary Service Area',
    towns: 'Glenview, Wilmette, Evanston, Highland Park',
    primary: true,
  },
  {
    region: 'Northwest Suburbs',
    towns: 'Park Ridge, Des Plaines, Barrington',
  },
  {
    region: 'Fox Valley',
    towns: 'Carpentersville, Elgin, Algonquin, West Dundee, Lake in the Hills',
  },
  {
    region: 'Chicago & Nearby',
    towns: 'Chicago, Cicero, Naperville',
  },
];

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
        subtitle="F&J's Stone Services designs and builds patios, retaining walls, walkways, and outdoor living spaces throughout Chicago's North Shore and surrounding communities. Explore our service area below — and if you don't see your town, reach out anyway."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {serviceAreas.map((area) => (
          <div
            key={area.region}
            className={`p-6 border transition-colors ${
              area.primary
                ? 'bg-[#990303]/5 border-2 border-[#990303]'
                : 'bg-white border-gray-200'
            }`}
          >
            <h3
              className={`font-bold mb-3 ${
                area.primary ? 'text-xl text-[#990303]' : 'text-lg text-gray-900'
              }`}
            >
              {area.region}
              {area.note && (
                <span className="block text-sm font-semibold text-[#990303] mt-1">
                  {area.note}
                </span>
              )}
            </h3>
            <p className="text-gray-700 leading-relaxed">{area.towns}</p>
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
