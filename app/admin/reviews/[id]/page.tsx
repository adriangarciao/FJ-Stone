import { notFound } from 'next/navigation';
import { getReviewById } from '@/lib/supabase/admin-queries';
import ReviewFormClient from '../ReviewFormClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditReviewPage({ params }: PageProps) {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Review</h1>
      <p className="text-gray-600 mb-8">Update this customer review.</p>

      <ReviewFormClient review={review} />
    </div>
  );
}
