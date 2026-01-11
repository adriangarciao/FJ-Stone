import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar, Footer } from '@/components';
import { EditModeWrapper } from '@/components/admin';
import { getSiteSettings } from '@/lib/supabase/queries';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: "F&J's Stone Services | Expert Stonework & Outdoor Living",
  description:
    'Expert hardscaping, patios, retaining walls, and stonework for residential and commercial properties. Quality craftsmanship built to last.',
  keywords: [
    'hardscaping',
    'stonework',
    'patios',
    'retaining walls',
    'outdoor kitchens',
    'driveways',
    'walkways',
    'construction',
  ],
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
        <EditModeWrapper>
          <Navbar />
          <main>{children}</main>
          <Footer siteSettings={siteSettings} />
        </EditModeWrapper>
      </body>
    </html>
  );
}
