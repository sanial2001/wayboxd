import type { Metadata } from 'next';
import { PlaceCard } from '@/components/features/places/PlaceCard';
import { Container } from '@/components/ui/Container';
import { places } from '@/data/mock';

export const metadata: Metadata = {
  title: 'Places',
};

export default function PlacesPage() {
  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
          Places with feelings
        </h1>
        <p className="mt-3 text-muted">
          Destinations, hangouts, and &ldquo;we should go sometime&rdquo; spots — all carrying other
          people&apos;s unfiltered drama.
        </p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {places.map((place, i) => (
          <PlaceCard
            key={place.id}
            place={place}
            featured={i === 0}
            tilt={i % 3 === 1 ? 'right' : i % 3 === 2 ? 'left' : false}
          />
        ))}
      </div>
    </Container>
  );
}
