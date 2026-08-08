import type { Metadata } from 'next';
import { PlaceCard } from '@/components/features/places/PlaceCard';
import { ReviewCard } from '@/components/features/places/ReviewCard';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { places, reviews } from '@/data/mock';

export const metadata: Metadata = {
  title: 'Discover',
};

export default function DiscoverPage() {
  return (
    <Container className="space-y-12 py-8 sm:py-10">
      <header className="max-w-3xl">
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-purple">
          The feed that actually slaps
        </p>
        <h1 className="mt-2 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
          People have opinions.
        </h1>
        <p className="mt-3 text-lg text-muted">
          Places heating up, takes flying in, zero five-star fluff written by a marketing intern.
        </p>
      </header>

      <section>
        <SectionHeader
          title="Heating up"
          description="If everyone's talking about it, you should at least have an opinion ready."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {places.map((place, i) => (
            <PlaceCard key={place.id} place={place} tilt={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Fresh takes"
          description="Still warm from someone's keyboard. Handle with curiosity."
        />
        <div className="mx-auto grid max-w-3xl gap-5">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} tilt={i % 2 === 0 ? 'right' : false} />
          ))}
        </div>
      </section>
    </Container>
  );
}
