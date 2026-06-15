import { Star, Quote } from 'lucide-react';
import { Review } from '@/lib/types';
import Reveal from './Reveal';

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <Reveal
      delay={index * 0.1}
      className="bg-white border border-gray-200 p-8 relative"
    >
      {/* Quote Icon */}
      <Quote
        size={40}
        className="absolute top-6 right-6 text-[#990303]/20"
      />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={
              i < review.rating
                ? 'fill-[#990303] text-[#990303]'
                : 'text-gray-300'
            }
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-600 mb-6 leading-relaxed">{review.text}</p>

      {/* Author */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">{review.name}</p>
          {review.source && (
            <p className="text-sm text-gray-500">via {review.source}</p>
          )}
        </div>
      </div>
    </Reveal>
  );
}

