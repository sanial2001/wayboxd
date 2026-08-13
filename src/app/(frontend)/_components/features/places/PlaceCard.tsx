import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import { people } from '@/data/mock';
import { cn } from '@/lib/cn';
import type { Place } from '@/types';

type PlaceCardProps = {
  place: Place;
  tilt?: boolean | 'left' | 'right';
  className?: string;
  featured?: boolean;
};

export function PlaceCard({ place, tilt, className, featured = false }: PlaceCardProps) {
  const author = place.excerptAuthor
    ? people.find((p) => p.username === place.excerptAuthor)
    : undefined;

  return (
    <Card
      as="article"
      padded={false}
      interactive
      tilt={tilt}
      className={cn('overflow-hidden', className)}
    >
      <Link href={`/places/${place.slug}`} className="block">
        <div className={cn('relative', featured ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
          <Image
            src={place.image}
            alt={place.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
              {place.name}
            </h3>
            <p className="text-sm text-white/90">
              {place.city}, {place.country}
            </p>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <Rating value={place.rating} size="sm" />
            <span className="text-sm text-muted">{place.reviewCount.toLocaleString()} takes</span>
          </div>
          {place.excerpt ? (
            <blockquote className="border-l-[4px] border-lime pl-3 text-sm leading-relaxed">
              <p className="font-medium">&ldquo;{place.excerpt}&rdquo;</p>
              {author ? (
                <footer className="mt-2 flex items-center gap-2 text-muted">
                  <Avatar
                    src={author.avatar}
                    alt={`@${author.username}`}
                    size="sm"
                    className="!h-6 !w-6"
                  />
                  <cite className="not-italic font-display text-xs font-bold uppercase">
                    @{author.username}
                  </cite>
                </footer>
              ) : null}
            </blockquote>
          ) : null}
        </div>
      </Link>
    </Card>
  );
}
