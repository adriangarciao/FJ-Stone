'use client';

import { useState } from 'react';
import { Save, CheckCircle, X } from 'lucide-react';
import { updateSiteSettings } from '@/app/actions/admin';
import type { SiteSettings } from '@/lib/types';

interface SettingsFormClientProps {
  settings: SiteSettings | null;
}

export default function SettingsFormClient({ settings }: SettingsFormClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateSiteSettings(formData);

    setIsSaving(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to save settings');
    }
  };

  if (!settings) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-6">
        <p className="text-yellow-700">
          Site settings not found. Please run the database setup script to create
          the initial settings row.
        </p>
      </div>
    );
  }

  return (
    <>
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-500" />
          <p className="text-green-700">Settings saved successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3">
          <X size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Business Info Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Business Information
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="business_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  defaultValue={settings.business_name}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={settings.phone}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={settings.email}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="service_area"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Area
                </label>
                <input
                  type="text"
                  id="service_area"
                  name="service_area"
                  defaultValue={settings.service_area}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853]"
                />
              </div>
            </div>
          </div>

          {/* Hero Content Section */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Hero Section Content
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="hero_headline"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hero Headline
                </label>
                <input
                  type="text"
                  id="hero_headline"
                  name="hero_headline"
                  defaultValue={settings.hero_headline}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853]"
                />
              </div>

              <div>
                <label
                  htmlFor="hero_subheadline"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Hero Subheadline
                </label>
                <textarea
                  id="hero_subheadline"
                  name="hero_subheadline"
                  defaultValue={settings.hero_subheadline}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#d4a853] hover:bg-[#c49943] disabled:bg-gray-400 text-[#1a1a2e] px-6 py-3 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin w-5 h-5 border-2 border-[#1a1a2e] border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
