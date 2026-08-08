import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Stamp } from '@/components/ui/Stamp';
import type { Place } from '@/types';

type PlaceHeroProps = {
  place: Place;
};

export function PlaceHero({ place }: PlaceHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border-[3px] border-border shadow-chunky-lg">
      <div className="relative aspect-[16/11] min-h-[280px] sm:aspect-[21/9] sm:min-h-[360px]">
        <Image
          src={place.image}
          alt={`${place.name} in ${place.city}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
          <Stamp className="border-white text-white">Stamp-worthy</Stamp>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
          <div className="flex flex-wrap gap-2">
            {place.categories?.map((cat) => (
              <Badge key={cat} tone="lime">
                {cat}
              </Badge>
            ))}
          </div>
          <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
            {place.name}
          </h1>
          <p className="mt-1 text-lg text-white/90">
            {place.city}, {place.country}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Rating value={place.rating} size="lg" className="text-white" />
            <span className="font-display text-sm font-bold uppercase tracking-wide text-white/85">
              {place.reviewCount.toLocaleString()} loud opinions
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="lime" size="sm">
              Pocket it
            </Button>
            <Button href="/review/new" variant="primary" size="sm">
              Have a take
            </Button>
            <Button variant="secondary" size="sm" className="!bg-white/95">
              Pass it on
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
