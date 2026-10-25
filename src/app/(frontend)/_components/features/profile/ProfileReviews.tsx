import { ReviewModel } from '@/app/api/model/response/review-model';

type ProfileReviewsProps = {
  reviews: ReviewModel[];
};

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
  if (reviews.length === 0) {
    return (
      <p className="rounded-[1.75rem] border-[3px] border-border bg-surface px-5 py-10 text-center text-muted shadow-chunky">
        No reviews filed yet.
      </p>
    );
  }

  return (
    <ul className="mx-auto flex max-w-2xl flex-col gap-4">
      {reviews.map((review) => (
        <li key={review.id}>
          <article className="rounded-[1.75rem] border-[3px] border-border bg-surface px-5 py-5 shadow-chunky">
            <p className="whitespace-pre-wrap text-base leading-relaxed">{review.body}</p>
            <p className="mt-3 text-sm text-muted">{formatReviewDate(review.createdAt)}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
