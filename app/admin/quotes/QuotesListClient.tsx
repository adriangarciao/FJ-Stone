'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Trash2 } from 'lucide-react';
import { updateQuoteStatus, deleteQuote } from '@/app/actions/admin';
import type { QuoteRequest } from '@/lib/types';

interface QuotesListClientProps {
  quotes: QuoteRequest[];
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  SCHEDULED: 'bg-purple-100 text-purple-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-gray-100 text-gray-700',
};

const statusOptions = ['NEW', 'CONTACTED', 'SCHEDULED', 'WON', 'LOST'];

export default function QuotesListClient({ quotes }: QuotesListClientProps) {
  const [filter, setFilter] = useState<string>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredQuotes =
    filter === 'All'
      ? quotes
      : quotes.filter((q) => q.status === filter);

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    setUpdatingId(quoteId);
    const result = await updateQuoteStatus(quoteId, newStatus);
    setUpdatingId(null);

    if (!result.success) {
      alert(result.error || 'Failed to update status');
    }
  };

  const handleDelete = async (quoteId: string) => {
    if (!confirm('Are you sure you want to delete this quote request?')) return;

    setDeletingId(quoteId);
    const result = await deleteQuote(quoteId);
    setDeletingId(null);

    if (!result.success) {
      alert(result.error || 'Failed to delete quote');
    }
  };

  return (
    <>
      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...statusOptions].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-[#1a1a2e] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status}
            {status !== 'All' && (
              <span className="ml-1 text-xs">
                ({quotes.filter((q) => q.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredQuotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-white border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {quote.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold ${
                      statusColors[quote.status]
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <a
                    href={`tel:${quote.phone}`}
                    className="flex items-center gap-1 hover:text-[#d4a853]"
                  >
                    <Phone size={14} />
                    {quote.phone}
                  </a>
                  {quote.email && (
                    <a
                      href={`mailto:${quote.email}`}
                      className="flex items-center gap-1 hover:text-[#d4a853]"
                    >
                      <Mail size={14} />
                      {quote.email}
                    </a>
                  )}
                  {quote.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {quote.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right flex items-start gap-4">
                <div>
                  <span className="text-sm bg-gray-100 px-3 py-1">
                    {quote.service_type}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(quote.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(quote.id)}
                  disabled={deletingId === quote.id}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{quote.description}</p>

            {quote.files && quote.files.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50">
                <p className="text-sm text-gray-500 mb-2">
                  {quote.files.length} file(s) attached
                </p>
                <div className="flex flex-wrap gap-2">
                  {quote.files.map((file) => (
                    <span
                      key={file.id}
                      className="text-xs bg-gray-200 px-2 py-1"
                    >
                      {file.file_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500">Status:</label>
                <select
                  value={quote.status}
                  onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                  disabled={updatingId === quote.id}
                  className="px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#d4a853] disabled:opacity-50"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {updatingId === quote.id && (
                  <span className="text-xs text-gray-400">Updating...</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredQuotes.length === 0 && (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No quotes with status "{filter}"</p>
          </div>
        )}
      </div>
    </>
  );
}
