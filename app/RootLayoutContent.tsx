'use client';

import { usePathname } from 'next/navigation';
import { Navbar, Footer } from '@/components';
import type { SiteSettings } from '@/lib/types';

interface RootLayoutContentProps {
  children: React.ReactNode;
  siteSettings: SiteSettings | null;
}

export default function RootLayoutContent({
  children,
  siteSettings,
}: RootLayoutContentProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    // Admin pages have their own layout - no public navbar/footer
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer siteSettings={siteSettings ?? undefined} />
    </>
  );
}
