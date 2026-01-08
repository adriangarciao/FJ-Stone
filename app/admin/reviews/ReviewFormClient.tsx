'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import { createReview, updateReview } from '@/app/actions/admin';
import type { Review } from '@/lib/types';

interface ReviewFormClientProps {
  review?: Review;
}

export default function ReviewFormClient({ review }: ReviewFormClientProps) {
  const router = useRouter();
  const isEditing = !!review;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = isEditing
      ? await updateReview(review.id, formData)
      : await createReview(formData);

    setIsSubmitting(false);

    if (result.success) {
      router.push('/admin/reviews');
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  return (
    <>
      <Link
        href="/admin/reviews"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Reviews
      </Link>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 flex items-start gap-3">
          <X size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={review?.name}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853]"
              placeholder="Customer name"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <select
                id="rating"
                name="rating"
                defaultValue={review?.rating ?? 5}
                required
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853] bg-white"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                Source
              </label>
              <input
                type="text"
                id="source"
                name="source"
                defaultValue={review?.source || ''}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853]"
                placeholder="Google, Yelp, Facebook"
              />
            </div>
          </div>

          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              Review Text <span className="text-red-500">*</span>
            </label>
            <textarea
              id="text"
              name="text"
              defaultValue={review?.text}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#d4a853] resize-none"
              placeholder="Write the customer review..."
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                value="true"
                defaultChecked={review?.is_featured}
                className="w-4 h-4 text-[#d4a853] focus:ring-[#d4a853]"
              />
              <span className="text-sm text-gray-700">Featured review</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_published"
                value="true"
                defaultChecked={review?.is_published ?? true}
                className="w-4 h-4 text-[#d4a853] focus:ring-[#d4a853]"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#d4a853] hover:bg-[#c49943] disabled:bg-gray-400 text-[#1a1a2e] px-6 py-3 font-semibold flex items-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin w-5 h-5 border-2 border-[#1a1a2e] border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEditing ? 'Update Review' : 'Create Review'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
