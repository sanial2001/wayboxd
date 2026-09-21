'use client';

import { useState } from 'react';
import { TripModel } from '@/app/api/model/response/trip-model';
import { EditTripModal } from '@/components/features/profile/EditTripModal';
import { TripCard } from '@/components/features/profile/TripCard';
import { TripViewModal } from '@/components/features/profile/TripViewModal';

type ProfileTripsProps = {
  trips: TripModel[];
  author: {
    displayName: string;
    avatarUrl: string | null;
  };
  isOwnProfile?: boolean;
  onTripUpdated?: (trip: TripModel) => void;
};

export function ProfileTrips({
  trips,
  author,
  isOwnProfile = false,
  onTripUpdated,
}: ProfileTripsProps) {
  const [viewingTrip, setViewingTrip] = useState<TripModel | null>(null);
  const [editingTrip, setEditingTrip] = useState<TripModel | null>(null);
  const [editKey, setEditKey] = useState(0);

  function openEdit(trip: TripModel) {
    setViewingTrip(null);
    setEditKey((current) => current + 1);
    setEditingTrip(trip);
  }

  function onUpdated(trip: TripModel) {
    onTripUpdated?.(trip);
    setEditingTrip(null);
    setViewingTrip(trip);
  }

  if (trips.length === 0) {
    return (
      <p className="rounded-[1.75rem] border-[3px] border-border bg-surface px-5 py-10 text-center text-muted shadow-chunky">
        No trips filed yet.
      </p>
    );
  }

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <li key={trip.id}>
            <TripCard trip={trip} onOpen={() => setViewingTrip(trip)} />
          </li>
        ))}
      </ul>

      <TripViewModal
        trip={viewingTrip}
        author={author}
        onClose={() => setViewingTrip(null)}
        onEdit={
          isOwnProfile && viewingTrip
            ? () => {
                openEdit(viewingTrip);
              }
            : undefined
        }
      />

      {editingTrip ? (
        <EditTripModal
          key={editKey}
          trip={editingTrip}
          onClose={() => setEditingTrip(null)}
          onUpdated={onUpdated}
        />
      ) : null}
    </div>
  );
}
