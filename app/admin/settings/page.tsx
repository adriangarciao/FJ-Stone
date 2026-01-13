import { getAdminSiteSettings } from '@/lib/supabase/admin-queries';
import SettingsFormClient from './SettingsFormClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Settings</h1>
        <p className="text-gray-600">Update your business information and site content.</p>
      </div>
      <SettingsFormClient settings={settings} />
    </div>
  );
}
