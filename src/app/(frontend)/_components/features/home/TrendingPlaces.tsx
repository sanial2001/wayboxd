import { PlaceCard } from '@/components/features/places/PlaceCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Place } from '@/types';

export function TrendingPlaces({ places }: { places: Place[] }) {
  return (
    <section>
      <SectionHeader
        eyebrow="Currently obsessed"
        title="Places I'd go back to"
        description="The spots people won't shut up about — in a good way."
        actionHref="/places"
        actionLabel="Show me everything"
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {places.map((place, index) => (
          <PlaceCard
            key={place.id}
            place={place}
            featured={index === 0}
            tilt={index % 3 === 0 ? 'left' : index % 3 === 1 ? 'right' : false}
          />
        ))}
      </div>
    </section>
  );
}
