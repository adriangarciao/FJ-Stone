import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePageClient from '@/app/HomePageClient';
import { projects, reviews, services, siteSettings } from '@/lib/dummy-data';

describe('HomePageClient', () => {
  it('renders key sections with supplied content', () => {
    render(
      <HomePageClient
        siteSettings={siteSettings}
        featuredProjects={projects.slice(0, 2)}
        featuredReviews={reviews.slice(0, 2)}
        featuredServices={services.slice(0, 2)}
      />
    );

    expect(screen.getByText(siteSettings.hero_headline)).toBeInTheDocument();
    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
    expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
    expect(screen.getByText(services[0].title)).toBeInTheDocument();
  });
});
