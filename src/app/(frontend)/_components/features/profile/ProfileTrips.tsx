'use client';

import { useEffect, useState } from 'react';
import { TripModel } from '@/app/api/model/response/trip-model';
import { AddTripModal } from '@/components/features/profile/AddTripModal';
import { TripCard } from '@/components/features/profile/TripCard';
import { TripViewModal } from '@/components/features/profile/TripViewModal';
import { Button } from '@/components/ui/Button';

type ProfileTripsProps = {
  trips: TripModel[];
  isOwnProfile: boolean;
  userId: number;
};

export function ProfileTrips({ trips: initialTrips, isOwnProfile, userId }: ProfileTripsProps) {
  const [trips, setTrips] = useState(initialTrips);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [viewingTrip, setViewingTrip] = useState<TripModel | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeoutId = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function openModal() {
    setModalKey((current) => current + 1);
    setModalOpen(true);
  }

  function onSaved(trip: TripModel) {
    setTrips((current) => [trip, ...current.filter((item) => item.id !== trip.id)]);
    setModalOpen(false);
    setToast('Trip saved');
  }

  return (
    <div className="space-y-4">
      {isOwnProfile ? (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={openModal}
            className="rounded-full bg-tangerine text-ink hover:bg-tangerine"
          >
            + Add trip
          </Button>
        </div>
      ) : null}

      {trips.length === 0 && !isOwnProfile ? (
        <p className="rounded-[1.75rem] border-[3px] border-border bg-surface px-5 py-10 text-center text-muted shadow-chunky">
          No trips filed yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <li key={trip.id}>
              <TripCard trip={trip} onOpen={() => setViewingTrip(trip)} />
            </li>
          ))}
          {isOwnProfile ? (
            <li>
              <button
                type="button"
                onClick={openModal}
                className="flex h-full min-h-[18rem] w-full flex-col items-center justify-center gap-2 rounded-[1.75rem] border-[3px] border-dashed border-border bg-transparent px-6 py-10 text-center text-muted transition hover:bg-surface/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] border-border font-display text-2xl leading-none">
                  +
                </span>
                <span className="font-display text-base font-bold text-ink">Upload a trip</span>
                <span className="text-sm">Cover · blurb · link</span>
              </button>
            </li>
          ) : null}
        </ul>
      )}

      {isOwnProfile ? (
        <AddTripModal
          key={modalKey}
          open={modalOpen}
          userId={userId}
          onClose={() => setModalOpen(false)}
          onSaved={onSaved}
        />
      ) : null}

      <TripViewModal trip={viewingTrip} onClose={() => setViewingTrip(null)} />

      {toast ? (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border-[3px] border-border bg-lime px-4 py-2 font-display text-sm font-bold uppercase shadow-chunky"
        >
          {toast}
        </p>
      ) : null}
    </div>
  );
}
