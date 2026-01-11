import { getAllQuoteRequests } from '@/lib/supabase/admin-queries';
import QuotesListClient from './QuotesListClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminQuotesPage() {
  const quotes = await getAllQuoteRequests();

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Requests</h1>
        <p className="text-gray-600">View and manage incoming quote requests.</p>
      </div>

      {quotes.length > 0 ? (
        <QuotesListClient quotes={quotes} />
      ) : (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No quote requests yet.</p>
        </div>
      )}
    </div>
  );
}
