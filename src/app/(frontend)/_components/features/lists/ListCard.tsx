import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import type { PlaceList } from '@/types';

type ListCardProps = {
  list: PlaceList;
  tilt?: boolean | 'left' | 'right';
  className?: string;
};

export function ListCard({ list, tilt, className }: ListCardProps) {
  return (
    <Card
      as="article"
      padded={false}
      interactive
      tilt={tilt}
      className={cn('overflow-hidden', className)}
    >
      <Link href={`/lists/${list.slug}`} className="block">
        <div className="relative aspect-[16/10]">
          <Image
            src={list.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-lime">
              {list.placeCount} stops
            </p>
            <h3 className="mt-1 font-display text-xl font-extrabold uppercase leading-tight sm:text-2xl">
              {list.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2 p-4">
          <Avatar src={list.author.avatar} alt={`@${list.author.username}`} size="sm" />
          <span className="font-display text-xs font-bold uppercase text-muted">
            cooked by @{list.author.username}
          </span>
        </div>
      </Link>
    </Card>
  );
}
