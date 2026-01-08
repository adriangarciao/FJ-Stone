import { Suspense } from 'react';
import {
  getSiteSettings,
  getFeaturedProjects,
  getFeaturedReviews,
} from '@/lib/supabase/queries';
import { services } from '@/lib/dummy-data';
import HomePageClient from './HomePageClient';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [siteSettings, featuredProjects, featuredReviews] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getFeaturedReviews(),
  ]);

  // Services are static content - not stored in DB
  const featuredServices = services.slice(0, 6);

  return (
    <HomePageClient
      siteSettings={siteSettings}
      featuredProjects={featuredProjects}
      featuredReviews={featuredReviews}
      featuredServices={featuredServices}
    />
  );
}
