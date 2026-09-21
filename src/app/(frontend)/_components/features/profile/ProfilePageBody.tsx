'use client';

import { useEffect, useState } from 'react';
import { PublicUserProfileView } from '@/app/api/model/response/public-user-profile-view';
import { TripModel } from '@/app/api/model/response/trip-model';
import { AddTripModal } from '@/components/features/profile/AddTripModal';
import { ProfileHero } from '@/components/features/profile/ProfileHero';
import { ProfileTrips } from '@/components/features/profile/ProfileTrips';

type ProfilePageBodyProps = {
  profile: PublicUserProfileView;
  isOwnProfile: boolean;
  trips: TripModel[];
};

export function ProfilePageBody({
  profile,
  isOwnProfile,
  trips: initialTrips,
}: ProfilePageBodyProps) {
  const [trips, setTrips] = useState(initialTrips);
  const [addOpen, setAddOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeoutId = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  function openAddTrip() {
    setModalKey((current) => current + 1);
    setAddOpen(true);
  }

  function onSaved(trip: TripModel) {
    setTrips((current) => [trip, ...current.filter((item) => item.id !== trip.id)]);
    setAddOpen(false);
    setToast('Trip saved');
  }

  function onTripUpdated(trip: TripModel) {
    setTrips((current) => current.map((item) => (item.id === trip.id ? trip : item)));
    setToast('Trip updated');
  }

  return (
    <>
      <ProfileHero
        profile={profile}
        isOwnProfile={isOwnProfile}
        onAddTrip={isOwnProfile ? openAddTrip : undefined}
      />

      <section>
        <h2 className="sr-only">Trips</h2>
        <ProfileTrips
          trips={trips}
          isOwnProfile={isOwnProfile}
          onTripUpdated={isOwnProfile ? onTripUpdated : undefined}
          author={{
            displayName: profile.displayName?.trim() || profile.username,
            avatarUrl: profile.avatarUrl,
          }}
        />
      </section>

      {isOwnProfile ? (
        <AddTripModal
          key={modalKey}
          open={addOpen}
          userId={profile.userId}
          onClose={() => setAddOpen(false)}
          onSaved={onSaved}
        />
      ) : null}

      {toast ? (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border-[3px] border-border bg-lime px-4 py-2 font-display text-sm font-bold uppercase shadow-chunky"
        >
          {toast}
        </p>
      ) : null}
    </>
  );
}
