import {
  getSiteSettings,
  getFeaturedProjects,
  getFeaturedReviews,
} from '@/lib/supabase/queries';
import { getContentBlocks } from '@/lib/supabase/content-queries';
import { services } from '@/lib/dummy-data';
import HomePageClient from './HomePageClient';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [siteSettings, featuredProjects, featuredReviews, contentBlocks] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getFeaturedReviews(),
    getContentBlocks([
      'home.hero.headline',
      'home.hero.subheadline',
      'home.hero.cta_primary',
      'home.hero.cta_secondary',
      'home.hero.tagline',
    ]),
  ]);

  // Services are static content - not stored in DB
  const featuredServices = services.slice(0, 6);

  return (
    <HomePageClient
      siteSettings={siteSettings}
      featuredProjects={featuredProjects}
      featuredReviews={featuredReviews}
      featuredServices={featuredServices}
      contentBlocks={contentBlocks}
    />
  );
}
