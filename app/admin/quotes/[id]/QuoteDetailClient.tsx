'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Copy,
  Check,
  MessageSquare,
  Clock,
  User,
  FileText,
} from 'lucide-react';
import { updateQuoteStatus } from '@/app/actions/admin';
import { ImageLightbox } from '@/components';
import type { QuoteRequest } from '@/lib/types';

interface QuoteDetailClientProps {
  quote: QuoteRequest;
  signedUrls: Record<string, string | null>;
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700 border-blue-200',
  CONTACTED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  SCHEDULED: 'bg-purple-100 text-purple-700 border-purple-200',
  WON: 'bg-green-100 text-green-700 border-green-200',
  LOST: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusOptions = ['NEW', 'CONTACTED', 'SCHEDULED', 'WON', 'LOST'];

/**
 * Format a normalized phone number (digits only) for display.
 */
function formatPhoneForDisplay(digits: string): string {
  // Handle 11-digit numbers starting with 1 (US country code)
  if (digits.length === 11 && digits.startsWith('1')) {
    const areaCode = digits.slice(1, 4);
    const exchange = digits.slice(4, 7);
    const subscriber = digits.slice(7, 11);
    return `1 (${areaCode}) ${exchange}-${subscriber}`;
  }
  // Handle standard 10-digit US numbers
  if (digits.length === 10) {
    const areaCode = digits.slice(0, 3);
    const exchange = digits.slice(3, 6);
    const subscriber = digits.slice(6, 10);
    return `(${areaCode}) ${exchange}-${subscriber}`;
  }
  // Fallback: return as-is if not a standard format
  return digits;
}

export default function QuoteDetailClient({
  quote,
  signedUrls,
}: QuoteDetailClientProps) {
  const [status, setStatus] = useState(quote.status);
  const [notes, setNotes] = useState(quote.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Prepare images for lightbox
  const images = (quote.files || [])
    .map((file) => ({
      src: signedUrls[file.id] || '',
      alt: file.original_name || file.file_name || 'Quote image',
    }))
    .filter((img) => img.src);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const result = await updateQuoteStatus(quote.id, newStatus, notes);
    setIsUpdating(false);

    if (result.success) {
      setStatus(newStatus as typeof status);
    } else {
      alert(result.error || 'Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    setIsUpdating(true);
    const result = await updateQuoteStatus(quote.id, status, notes);
    setIsUpdating(false);

    if (!result.success) {
      alert(result.error || 'Failed to save notes');
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formattedPhone = formatPhoneForDisplay(quote.phone);

  return (
    <>
      {/* Header */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{quote.name}</h1>
              <span
                className={`px-3 py-1 text-sm font-semibold border ${statusColors[status]}`}
              >
                {status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>
                {new Date(quote.created_at).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="bg-gray-100 px-4 py-2 text-sm font-medium">
              {quote.service_type}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              ID: {quote.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <a
                  href={`tel:+1${quote.phone.replace(/^1/, '')}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#990303] transition-colors"
                >
                  <Phone size={18} className="text-gray-400" />
                  <span className="font-medium">{formattedPhone}</span>
                </a>
                <button
                  onClick={() => copyToClipboard(quote.phone, 'phone')}
                  className="p-2 text-gray-400 hover:text-[#990303] transition-colors"
                  title="Copy phone number"
                >
                  {copied === 'phone' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              {quote.email && (
                <div className="flex items-center justify-between">
                  <a
                    href={`mailto:${quote.email}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#990303] transition-colors"
                  >
                    <Mail size={18} className="text-gray-400" />
                    <span className="font-medium">{quote.email}</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(quote.email!, 'email')}
                    className="p-2 text-gray-400 hover:text-[#990303] transition-colors"
                    title="Copy email"
                  >
                    {copied === 'email' ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              )}

              {quote.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin size={18} className="text-gray-400" />
                  <span>{quote.location}</span>
                </div>
              )}

              {quote.preferred_contact && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock size={18} className="text-gray-400" />
                  <span>
                    Preferred contact: <span className="font-medium capitalize">{quote.preferred_contact}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Quick Copy All */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() =>
                  copyToClipboard(
                    `${quote.name}\n${formattedPhone}\n${quote.email || ''}${quote.location ? `\n${quote.location}` : ''}`,
                    'all'
                  )
                }
                className="text-sm text-[#990303] hover:text-[#71706e] font-medium flex items-center gap-2"
              >
                {copied === 'all' ? (
                  <>
                    <Check size={14} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy all contact info
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Project Description */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={18} />
              Project Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{quote.description}</p>
          </div>

          {/* Uploaded Photos */}
          {quote.files && quote.files.length > 0 && (
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Uploaded Photos ({quote.files.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {quote.files.map((file, index) => {
                  const signedUrl = signedUrls[file.id];
                  return (
                    <div key={file.id} className="relative group">
                      {signedUrl ? (
                        <button
                          onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
                          className="w-full aspect-square bg-gray-100 overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={signedUrl}
                            alt={file.original_name || file.file_name || 'Quote image'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </button>
                      ) : (
                        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            Unable to load
                          </span>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500 truncate">
                        {file.original_name || file.file_name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Update Status
            </h2>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#990303] disabled:opacity-50"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {isUpdating && (
              <p className="text-xs text-gray-400 mt-2">Updating...</p>
            )}
          </div>

          {/* Admin Notes */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare size={18} />
              Internal Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this quote..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#990303] resize-none"
            />
            <button
              onClick={handleSaveNotes}
              disabled={isUpdating}
              className="mt-3 w-full bg-[#292323] hover:bg-[#71706e] disabled:bg-gray-400 text-white px-4 py-2 font-medium transition-colors"
            >
              {isUpdating ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {images.length > 0 && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
