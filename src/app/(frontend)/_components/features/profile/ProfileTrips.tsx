import { TripModel } from '@/app/api/model/response/trip-model';
import { TripCard } from '@/components/features/profile/TripCard';

type ProfileTripsProps = {
  trips: TripModel[];
};

export function ProfileTrips({ trips }: ProfileTripsProps) {
  if (trips.length === 0) {
    return (
      <p className="rounded-[1.75rem] border-[3px] border-border bg-surface px-5 py-10 text-center text-muted shadow-chunky">
        No trips filed yet.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <li key={trip.id}>
          <TripCard trip={trip} />
        </li>
      ))}
    </ul>
  );
}
