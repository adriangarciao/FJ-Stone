'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import { deleteReview } from '@/app/actions/admin';
import type { Review } from '@/lib/types';

interface ReviewsListClientProps {
  reviews: Review[];
}

export default function ReviewsListClient({ reviews }: ReviewsListClientProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setDeletingId(reviewId);
    const result = await deleteReview(reviewId);
    setDeletingId(null);

    if (!result.success) {
      alert(result.error || 'Failed to delete review');
    }
  };

  return (
    <div className="grid gap-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-semibold text-gray-900">{review.name}</h3>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? 'fill-[#d4a853] text-[#d4a853]'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                {review.source && (
                  <span className="text-sm text-gray-500">
                    via {review.source}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">{review.text}</p>
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center gap-1 text-sm ${
                    review.is_published ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {review.is_published ? (
                    <>
                      <Eye size={14} />
                      Published
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} />
                      Hidden
                    </>
                  )}
                </span>
                {review.is_featured && (
                  <span className="text-sm bg-[#d4a853]/20 text-[#d4a853] px-2 py-0.5">
                    Featured
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Link
                href={`/admin/reviews/${review.id}`}
                className="p-2 text-gray-500 hover:text-[#d4a853] transition-colors"
              >
                <Edit size={18} />
              </Link>
              <button
                onClick={() => handleDelete(review.id)}
                disabled={deletingId === review.id}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
