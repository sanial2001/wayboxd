import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import type { Review } from '@/types';

type ReviewCardProps = {
  review: Review;
  tilt?: boolean | 'left' | 'right';
};

export function ReviewCard({ review, tilt }: ReviewCardProps) {
  return (
    <Card as="article" interactive tilt={tilt} className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/profile/${review.author.username}`} className="flex items-center gap-3">
          <Avatar src={review.author.avatar} alt={`@${review.author.username}`} />
          <div>
            <p className="font-display font-bold uppercase">@{review.author.username}</p>
            <p className="text-sm text-muted">
              {review.createdAt}
              {review.photoCount > 0 ? ` · ${review.photoCount} receipts` : ''}
            </p>
          </div>
        </Link>
        <Rating value={review.rating} size="sm" />
      </div>

      <h3 className="font-display text-2xl font-extrabold leading-tight text-balance sm:text-3xl">
        &ldquo;{review.title}&rdquo;
      </h3>

      {review.body ? <p className="leading-relaxed text-muted">{review.body}</p> : null}

      {review.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <Badge key={tag} tone="sky">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 border-t-[3px] border-border pt-3 text-sm font-medium">
        <span>❤️ {review.likes} feels</span>
        <span>💬 {review.comments} replies</span>
        {review.wouldGoAgain != null ? (
          <span className="text-muted">
            {review.wouldGoAgain ? 'Would go again' : 'One and done'}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
