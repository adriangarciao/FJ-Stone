import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { EditModeWrapper } from '@/components/admin';
import { StructuredData } from '@/components';
import { getSiteSettings } from '@/lib/supabase/queries';
import RootLayoutContent from './RootLayoutContent';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fjstoneservices.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "F&J's Stone Services | Expert Stonework & Outdoor Living",
    template: "%s | F&J's Stone Services",
  },
  description:
    'Expert hardscaping, patios, retaining walls, and stonework for residential and commercial properties in the Greater Chicago Area. Quality craftsmanship built to last.',
  keywords: [
    'hardscaping',
    'stonework',
    'patios',
    'retaining walls',
    'outdoor kitchens',
    'driveways',
    'walkways',
    'stone contractor',
    'Chicago hardscaping',
    'paver installation',
  ],
  authors: [{ name: "F&J's Stone Services" }],
  creator: "F&J's Stone Services",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: "F&J's Stone Services",
    title: "F&J's Stone Services | Expert Stonework & Outdoor Living",
    description:
      'Transform your outdoor space with expert hardscaping, patios, and stonework. Serving the Greater Chicago Area with quality craftsmanship.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "F&J's Stone Services - Expert Hardscaping",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "F&J's Stone Services | Expert Stonework & Outdoor Living",
    description:
      'Transform your outdoor space with expert hardscaping, patios, and stonework. Serving the Greater Chicago Area.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  themeColor: '#990303',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <StructuredData />
        <EditModeWrapper>
          <RootLayoutContent siteSettings={siteSettings}>
            {children}
          </RootLayoutContent>
        </EditModeWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
      <GoogleAnalytics gaId="G-7WLRM8K4SB" />
    </html>
  );
}
