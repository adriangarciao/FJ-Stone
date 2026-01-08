import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminLayoutClient from './AdminLayoutClient';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get current path (we need to allow login page)
  // The middleware already handles redirecting non-logged-in users to login

  if (!user) {
    // This layout is only used for non-login pages
    // The middleware redirects to /admin/login if not authenticated
    return <>{children}</>;
  }

  // Check if user is admin
  const { data: isAdmin } = await supabase.rpc('is_admin');

  if (!isAdmin) {
    // User is logged in but not an admin
    redirect('/admin/unauthorized');
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
