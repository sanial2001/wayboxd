'use client';

import { useEffect, useId } from 'react';
import { ReviewModel } from '@/app/api/model/response/review-model';
import { Badge } from '@/components/ui/Badge';
import { CloseButton } from '@/components/ui/CloseButton';
import { Rating } from '@/components/ui/Rating';
import { formatTripMonthYear, formatTripPlaceLabel } from '@/lib/trip-display';

type ReviewViewModalProps = {
  review: ReviewModel | null;
  onClose: () => void;
};

export function ReviewViewModal({ review, onClose }: ReviewViewModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!review) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) {
        return;
      }
      onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [review, onClose]);

  if (!review) {
    return null;
  }

  const visited = review.visitDate ? formatTripMonthYear(review.visitDate) : '';
  const posted = formatReviewDate(review.createdAt);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-4 sm:p-8">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close review"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 my-4 w-full max-w-2xl rounded-[2rem] border-[3px] border-border bg-surface shadow-chunky-lg"
      >
        <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-display text-3xl font-black leading-tight tracking-tight"
            >
              {review.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{formatTripPlaceLabel(review.place)}</p>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <div className="space-y-4 px-5 py-4 sm:px-6">
          <Rating value={review.rating} />

          {review.body ? (
            <p className="whitespace-pre-wrap text-base leading-relaxed">{review.body}</p>
          ) : null}

          {review.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {review.tags.map((tag) => (
                <Badge key={tag} tone="sky">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          <p className="text-sm text-muted">
            {[posted, visited ? `Visited ${visited}` : '', wouldGoAgainLabel(review.wouldGoAgain)]
              .filter((part) => part.length > 0)
              .join(' · ')}
          </p>
        </div>
      </div>
    </div>
  );
}

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
