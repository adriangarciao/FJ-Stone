/**
 * Single source of truth for the towns F&J's Stone Services covers.
 *
 * Both the visible "Areas We Serve" section and the LocalBusiness JSON-LD
 * (`areaServed`) read from here, so the on-page copy and the structured data
 * a search crawler indexes never drift apart.
 */
export interface ServiceArea {
  region: string;
  /** Optional qualifier shown next to the region label (e.g. the primary area). */
  note?: string;
  towns: string[];
}

export const serviceAreas: ServiceArea[] = [
  {
    region: 'North Shore',
    note: 'Primary Service Area',
    towns: ['Glenview', 'Wilmette', 'Evanston', 'Highland Park'],
  },
  {
    region: 'Northwest Suburbs',
    towns: ['Park Ridge', 'Des Plaines', 'Barrington'],
  },
  {
    region: 'Fox Valley',
    towns: [
      'Carpentersville',
      'Elgin',
      'Algonquin',
      'West Dundee',
      'Lake in the Hills',
    ],
  },
  {
    region: 'Chicago & Nearby',
    towns: ['Chicago', 'Cicero', 'Naperville'],
  },
];

/** Flat list of every town, for JSON-LD `areaServed`. */
export const serviceCities: string[] = serviceAreas.flatMap((area) => area.towns);
