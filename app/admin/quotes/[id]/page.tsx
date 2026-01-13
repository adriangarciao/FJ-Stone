import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getQuoteById, getQuoteFileSignedUrls } from '@/lib/supabase/admin-queries';
import QuoteDetailClient from './QuoteDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface QuoteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { id } = await params;
  const quote = await getQuoteById(id);

  if (!quote) {
    notFound();
  }

  // Generate signed URLs for files
  const signedUrls = await getQuoteFileSignedUrls(quote.files || []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href="/admin/quotes"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#990303] transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Quotes
        </Link>
      </div>

      <QuoteDetailClient quote={quote} signedUrls={signedUrls} />
    </div>
  );
}
