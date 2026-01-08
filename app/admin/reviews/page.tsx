import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllReviews } from '@/lib/supabase/admin-queries';
import ReviewsListClient from './ReviewsListClient';

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews</h1>
          <p className="text-gray-600">Manage customer reviews and testimonials.</p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="bg-[#990303] hover:bg-[#71706e] text-white border-2 border-white px-6 py-3 font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Review
        </Link>
      </div>

      {reviews.length > 0 ? (
        <ReviewsListClient reviews={reviews} />
      ) : (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No reviews yet.</p>
          <Link
            href="/admin/reviews/new"
            className="inline-flex items-center gap-2 text-[#990303] hover:text-[#71706e] font-medium"
          >
            <Plus size={18} />
            Add your first review
          </Link>
        </div>
      )}
    </div>
  );
}

