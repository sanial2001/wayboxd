import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatMembers } from '@/data/mock';
import { cn } from '@/lib/cn';
import type { Community } from '@/types';

const accentTone = {
  purple: 'purple',
  lime: 'lime',
  coral: 'coral',
  tangerine: 'tangerine',
  sky: 'sky',
  sun: 'sun',
  pink: 'pink',
} as const;

type CommunityCardProps = {
  community: Community;
  tilt?: boolean | 'left' | 'right';
  className?: string;
};

export function CommunityCard({ community, tilt, className }: CommunityCardProps) {
  return (
    <Card
      as="article"
      padded={false}
      interactive
      tilt={tilt}
      className={cn('overflow-hidden', className)}
    >
      <Link href={`/communities/${community.slug}`} className="block">
        <div className="relative aspect-[5/3]">
          <Image
            src={community.coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute left-3 top-3">
            <Badge tone={accentTone[community.accent]}>
              {formatMembers(community.memberCount)} in the club
            </Badge>
          </div>
        </div>
        <div className="space-y-2 p-4">
          <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
            {community.name}
          </h3>
          <p className="text-sm text-muted">{community.description}</p>
        </div>
      </Link>
    </Card>
  );
}
