'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Review } from '@/lib/types';

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-200 p-8 relative"
    >
      {/* Quote Icon */}
      <Quote
        size={40}
        className="absolute top-6 right-6 text-[#d4a853]/20"
      />

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={
              i < review.rating
                ? 'fill-[#d4a853] text-[#d4a853]'
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
    </motion.div>
  );
}
