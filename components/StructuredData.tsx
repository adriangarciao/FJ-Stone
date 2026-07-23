import { serviceCities } from '@/lib/serviceAreas';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://fjstoneservices.com';

/**
 * LocalBusiness (GeneralContractor) JSON-LD for the whole site.
 *
 * Rendered once from the root layout so every page carries the structured data.
 * `areaServed` is derived from the shared {@link serviceCities} list, keeping it
 * in lockstep with the visible "Areas We Serve" section.
 */
export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${siteUrl}/#business`,
    name: "F&J's Stone Services",
    description:
      'Expert hardscaping, patios, retaining walls, walkways, and stonework for residential and commercial properties in the Greater Chicago Area.',
    url: siteUrl,
    telephone: '+1-847-847-9376',
    email: 'fjstoneservices@gmail.com',
    image: `${siteUrl}/og-image.jpg`,
    logo: `${siteUrl}/images/fjstonelogo_cropped.webp`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'IL',
      addressCountry: 'US',
    },
    areaServed: serviceCities.map((city) => ({
      '@type': 'City',
      name: city,
    })),
    knowsAbout: [
      'Hardscaping',
      'Patios',
      'Retaining Walls',
      'Walkways',
      'Paver Installation',
      'Outdoor Living Spaces',
      'Stonework',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
