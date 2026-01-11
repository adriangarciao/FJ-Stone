import Link from 'next/link';
import { FolderOpen, Star, MessageSquare, Settings } from 'lucide-react';
import { getAllProjects, getAllReviews, getAllQuoteRequests } from '@/lib/supabase/admin-queries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const adminLinks = [
  {
    href: '/admin/projects',
    label: 'Projects',
    description: 'Manage portfolio projects and images',
    icon: FolderOpen,
    countKey: 'projects',
  },
  {
    href: '/admin/reviews',
    label: 'Reviews',
    description: 'Manage customer reviews and testimonials',
    icon: Star,
    countKey: 'reviews',
  },
  {
    href: '/admin/quotes',
    label: 'Quote Requests',
    description: 'View and manage incoming quote requests',
    icon: MessageSquare,
    countKey: 'quotes',
  },
  {
    href: '/admin/settings',
    label: 'Site Settings',
    description: 'Update business info and site content',
    icon: Settings,
    countKey: null,
  },
];

export default async function AdminPage() {
  const [projects, reviews, quotes] = await Promise.all([
    getAllProjects(),
    getAllReviews(),
    getAllQuoteRequests(),
  ]);

  const counts = {
    projects: projects.length,
    reviews: reviews.length,
    quotes: quotes.filter((q) => q.status === 'NEW').length,
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome to your admin dashboard. Manage your website content below.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block bg-white p-6 border border-gray-200 hover:border-[#990303] hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#990303]/10 flex items-center justify-center group-hover:bg-[#990303]/20 transition-colors">
                <link.icon size={24} className="text-[#990303]" />
              </div>
              {link.countKey && (
                <span className="text-2xl font-bold text-gray-900">
                  {counts[link.countKey as keyof typeof counts]}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {link.label}
            </h2>
            <p className="text-gray-600 text-sm">{link.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Quote Requests */}
      {quotes.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Quote Requests</h2>
            <Link
              href="/admin/quotes"
              className="text-[#990303] hover:text-[#71706e] font-medium text-sm"
            >
              View all →
            </Link>
          </div>
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                    Service
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotes.slice(0, 5).map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{quote.name}</td>
                    <td className="px-6 py-4 text-gray-600">{quote.service_type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold ${
                          quote.status === 'NEW'
                            ? 'bg-blue-100 text-blue-700'
                            : quote.status === 'CONTACTED'
                            ? 'bg-yellow-100 text-yellow-700'
                            : quote.status === 'SCHEDULED'
                            ? 'bg-purple-100 text-purple-700'
                            : quote.status === 'WON'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

