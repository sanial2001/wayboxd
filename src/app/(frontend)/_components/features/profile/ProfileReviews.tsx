'use client';

import { useState } from 'react';
import { ReviewModel } from '@/app/api/model/response/review-model';
import { ReviewViewModal } from '@/components/features/profile/ReviewViewModal';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { cn } from '@/lib/cn';
import { formatTripMonthYear, formatTripPlaceLabel } from '@/lib/trip-display';

type ProfileReviewsProps = {
  reviews: ReviewModel[];
};

function wouldGoAgainLabel(value: boolean | null): string {
  if (value === null) {
    return '';
  }
  return value ? 'Would go again' : 'Would not go again';
}

function formatReviewDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function ProfileReviews({ reviews }: ProfileReviewsProps) {
  const [viewingReview, setViewingReview] = useState<ReviewModel | null>(null);

  if (reviews.length === 0) {
    return (
      <p className="rounded-[1.75rem] border-[3px] border-border bg-surface px-5 py-10 text-center text-muted shadow-chunky">
        No reviews filed yet.
      </p>
    );
  }

  return (
    <div>
      <ul className="mx-auto flex max-w-2xl flex-col gap-4">
        {reviews.map((review) => {
          const visited = review.visitDate ? formatTripMonthYear(review.visitDate) : '';
          return (
            <li key={review.id}>
              <article className="overflow-hidden rounded-[1.75rem] border-[3px] border-border bg-surface shadow-chunky transition hover:-translate-y-0.5 hover:shadow-chunky-lg">
                <button
                  type="button"
                  onClick={() => setViewingReview(review)}
                  className={cn('flex w-full flex-col px-5 py-5 text-left')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-extrabold leading-tight">
                        {review.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {formatTripPlaceLabel(review.place)}
                      </p>
                    </div>
                    <Rating value={review.rating} size="sm" />
                  </div>

                  {review.body ? (
                    <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-base leading-relaxed">
                      {review.body}
                    </p>
                  ) : null}

                  {review.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {review.tags.map((tag) => (
                        <Badge key={tag} tone="sky">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  <p className="mt-3 text-sm text-muted">
                    {[
                      formatReviewDate(review.createdAt),
                      visited ? `Visited ${visited}` : '',
                      wouldGoAgainLabel(review.wouldGoAgain),
                    ]
                      .filter((part) => part.length > 0)
                      .join(' · ')}
                  </p>
                </button>
              </article>
            </li>
          );
        })}
      </ul>

      <ReviewViewModal
        key={viewingReview?.id ?? 'closed'}
        review={viewingReview}
        onClose={() => setViewingReview(null)}
      />
    </div>
  );
}
