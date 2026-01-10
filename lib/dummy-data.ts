import { Review, SiteSettings, Service } from './types';
import { portfolioProjects, getCategories } from '@/src/data/portfolioImages';

export const siteSettings: SiteSettings = {
  id: 1,
  business_name: "F&J's Stone Services",
  phone: '(847) 847-9376',
  email: 'fjstoneservices@gmail.com',
  service_area: 'Greater Chicago Area',
  hero_headline: 'Crafting Outdoor Spaces That Last',
  hero_subheadline: 'Expert hardscaping, patios, and stonework for residential and commercial properties. Quality craftsmanship built to withstand the test of time.',
  updated_at: new Date().toISOString(),
};

export const services: Service[] = [
  {
    id: '1',
    title: 'Patio Installation',
    description: 'Custom patios designed to enhance your outdoor living space. From natural stone to pavers, we create beautiful, functional areas for entertaining and relaxation.',
    icon: 'grid-3x3',
    features: [
      'Natural stone patios',
      'Paver installations',
      'Custom designs',
      'Drainage solutions',
    ],
  },
  {
    id: '2',
    title: 'Retaining Walls',
    description: 'Structural and decorative retaining walls that combine functionality with aesthetics. Perfect for managing slopes and creating usable outdoor space.',
    icon: 'layers',
    features: [
      'Structural engineering',
      'Natural stone walls',
      'Block retaining walls',
      'Terraced gardens',
    ],
  },
  {
    id: '3',
    title: 'Walkways & Paths',
    description: 'Elegant walkways and garden paths that guide visitors through your landscape while adding curb appeal and value to your property.',
    icon: 'move-horizontal',
    features: [
      'Flagstone paths',
      'Paver walkways',
      'Stepping stones',
      'Accessible design',
    ],
  },
  {
    id: '4',
    title: 'Driveways',
    description: 'Durable, attractive driveways built to handle daily use while making a great first impression. Multiple material options available.',
    icon: 'car',
    features: [
      'Paver driveways',
      'Concrete work',
      'Drainage systems',
      'Border accents',
    ],
  },
  {
    id: '5',
    title: 'Outdoor Kitchens',
    description: 'Complete outdoor kitchen installations featuring built-in grills, countertops, and custom stonework for the ultimate backyard experience.',
    icon: 'flame',
    features: [
      'Built-in grills',
      'Stone countertops',
      'Pizza ovens',
      'Bar seating areas',
    ],
  },
  {
    id: '6',
    title: 'Fire Features',
    description: 'Fire pits and outdoor fireplaces that create a warm gathering spot for family and friends. Custom designs to match your style.',
    icon: 'flame-kindling',
    features: [
      'Fire pits',
      'Outdoor fireplaces',
      'Gas & wood burning',
      'Seating walls',
    ],
  },
];

// Re-export portfolio projects as the main projects array
export const projects = portfolioProjects;

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Michael Thompson',
    rating: 5,
    text: 'FJ Stone transformed our backyard into an outdoor oasis. The patio and fire pit are absolutely stunning. Professional crew, great communication, and the quality of work exceeded our expectations.',
    source: 'Google',
    is_featured: true,
    is_published: true,
    created_at: '2024-10-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Sarah & David Chen',
    rating: 5,
    text: 'We had a challenging slope in our backyard that we thought was unusable. The team built a beautiful retaining wall system that gave us two flat terraces. Now we have room for a garden and a play area. Highly recommend!',
    source: 'Google',
    is_featured: true,
    is_published: true,
    created_at: '2024-09-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Jennifer Martinez',
    rating: 5,
    text: 'From the initial consultation to the final walkthrough, everything was seamless. Our new walkway and front patio have completely changed our home\'s curb appeal. Fair pricing and exceptional craftsmanship.',
    source: 'Facebook',
    is_featured: true,
    is_published: true,
    created_at: '2024-08-20T00:00:00Z',
  },
  {
    id: '4',
    name: 'Robert Williams',
    rating: 5,
    text: 'The outdoor kitchen they built for us is incredible. Every detail was carefully considered, and the stone work is beautiful. We\'ve already hosted several parties and gotten so many compliments.',
    source: 'Google',
    is_featured: false,
    is_published: true,
    created_at: '2024-07-10T00:00:00Z',
  },
];

// Service types derived from actual project categories
export const serviceTypes = getCategories();
