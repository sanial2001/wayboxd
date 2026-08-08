import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Person } from '@/types';

type PersonCardProps = {
  person: Person;
  tilt?: boolean | 'left' | 'right';
};

export function PersonCard({ person, tilt }: PersonCardProps) {
  return (
    <Card as="article" interactive tilt={tilt} className="flex h-full flex-col gap-4">
      <div className="flex items-start gap-3">
        <Avatar
          src={person.avatar}
          alt={`@${person.username}`}
          size="lg"
          href={`/profile/${person.username}`}
        />
        <div className="min-w-0 flex-1">
          <Link
            href={`/profile/${person.username}`}
            className="font-display text-lg font-extrabold uppercase hover:text-purple"
          >
            @{person.username}
          </Link>
          <p className="mt-1 text-sm leading-snug text-muted">{person.bio}</p>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl border-[2.5px] border-border bg-surface-2 px-3 py-2">
          <dt className="font-display text-[10px] font-bold uppercase tracking-wide text-muted">
            Opinions filed
          </dt>
          <dd className="font-display text-lg font-black">{person.placesReviewed}</dd>
        </div>
        <div className="rounded-xl border-[2.5px] border-border bg-surface-2 px-3 py-2">
          <dt className="font-display text-[10px] font-bold uppercase tracking-wide text-muted">
            Stamps collected
          </dt>
          <dd className="font-display text-lg font-black">{person.countriesVisited}</dd>
        </div>
      </dl>
      <Button variant="secondary" size="sm" className="mt-auto w-full">
        Follow their chaos
      </Button>
    </Card>
  );
}
