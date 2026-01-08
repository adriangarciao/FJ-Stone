import ReviewFormClient from '../ReviewFormClient';

export default function NewReviewPage() {
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">New Review</h1>
      <p className="text-gray-600 mb-8">Add a new customer review.</p>

      <ReviewFormClient />
    </div>
  );
}
