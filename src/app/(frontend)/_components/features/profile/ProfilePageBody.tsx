'use client';

import { useEffect, useState } from 'react';
import { sortTripsByTripDateDesc } from '@/app/_util/sort-trips-by-trip-date';
import { TripStatus } from '@/app/api/model/enums/trip-status';
import { PublicUserProfileView } from '@/app/api/model/response/public-user-profile-view';
import { ReviewModel } from '@/app/api/model/response/review-model';
import { TripModel } from '@/app/api/model/response/trip-model';
import { AddReviewModal } from '@/components/features/profile/AddReviewModal';
import { AddTripModal } from '@/components/features/profile/AddTripModal';
import { ProfileHero } from '@/components/features/profile/ProfileHero';
import { ProfileReviews } from '@/components/features/profile/ProfileReviews';
import { ProfileTabs } from '@/components/features/profile/ProfileTabs';
import { ProfileTrips } from '@/components/features/profile/ProfileTrips';

type SharedProfilePageProps = {
  profile: PublicUserProfileView;
  isOwnProfile: boolean;
};

type TripsProfilePageProps = SharedProfilePageProps & {
  section: 'trips';
  trips: TripModel[];
  drafts: TripModel[];
  reviewCount: number;
};

type ReviewsProfilePageProps = SharedProfilePageProps & {
  section: 'reviews';
  reviews: ReviewModel[];
  tripCount: number;
};

export type ProfilePageBodyProps = TripsProfilePageProps | ReviewsProfilePageProps;

function useToast() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeoutId = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  return { toast, setToast };
}

function ProfileToast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="status"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border-[3px] border-border bg-lime px-4 py-2 font-display text-sm font-bold uppercase shadow-chunky"
    >
      {message}
    </p>
  );
}

function TripsProfileBody({
  profile,
  isOwnProfile,
  trips: initialTrips,
  drafts: initialDrafts,
  reviewCount,
}: TripsProfilePageProps) {
  const [trips, setTrips] = useState(initialTrips);
  const [drafts, setDrafts] = useState(initialDrafts);
  const [addOpen, setAddOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const { toast, setToast } = useToast();

  function openAddTrip() {
    setModalKey((current) => current + 1);
    setAddOpen(true);
  }

  function onSaved(trip: TripModel) {
    if (trip.status === TripStatus.PUBLISHED) {
      setTrips((current) =>
        sortTripsByTripDateDesc([trip, ...current.filter((item) => item.id !== trip.id)])
      );
      setDrafts((current) => current.filter((item) => item.id !== trip.id));
    } else if (trip.status === TripStatus.DRAFT) {
      setDrafts((current) => [trip, ...current.filter((item) => item.id !== trip.id)]);
    }
    setAddOpen(false);
    setToast(trip.status === TripStatus.DRAFT ? 'Draft saved' : 'Trip saved');
  }

  function onTripUpdated(trip: TripModel) {
    setTrips((current) =>
      sortTripsByTripDateDesc(current.map((item) => (item.id === trip.id ? trip : item)))
    );
    setToast('Trip updated');
  }

  function onTripDeleted(trip: TripModel) {
    setTrips((current) => current.filter((item) => item.id !== trip.id));
    setToast('Trip deleted');
  }

  return (
    <>
      <ProfileHero
        profile={profile}
        isOwnProfile={isOwnProfile}
        section="trips"
        tripCount={trips.length}
        reviewCount={reviewCount}
        onAddTrip={isOwnProfile ? openAddTrip : undefined}
      />
      <ProfileTabs username={profile.username} section="trips" />

      <section>
        <h2 className="sr-only">Trips</h2>
        <ProfileTrips
          trips={trips}
          isOwnProfile={isOwnProfile}
          onTripUpdated={isOwnProfile ? onTripUpdated : undefined}
          onTripDeleted={isOwnProfile ? onTripDeleted : undefined}
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
          drafts={drafts}
          onClose={() => setAddOpen(false)}
          onSaved={onSaved}
        />
      ) : null}

      <ProfileToast message={toast} />
    </>
  );
}

function ReviewsProfileBody({
  profile,
  isOwnProfile,
  reviews: initialReviews,
  tripCount,
}: ReviewsProfilePageProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [addOpen, setAddOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const { toast, setToast } = useToast();

  function openAddReview() {
    setModalKey((current) => current + 1);
    setAddOpen(true);
  }

  function onSaved(review: ReviewModel) {
    setReviews((current) => [review, ...current.filter((item) => item.id !== review.id)]);
    setAddOpen(false);
    setToast('Review saved');
  }

  return (
    <>
      <ProfileHero
        profile={profile}
        isOwnProfile={isOwnProfile}
        section="reviews"
        tripCount={tripCount}
        reviewCount={reviews.length}
        onAddReview={isOwnProfile ? openAddReview : undefined}
      />
      <ProfileTabs username={profile.username} section="reviews" />

      <section>
        <h2 className="sr-only">Reviews</h2>
        <ProfileReviews reviews={reviews} />
      </section>

      {isOwnProfile ? (
        <AddReviewModal
          key={modalKey}
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSaved={onSaved}
        />
      ) : null}

      <ProfileToast message={toast} />
    </>
  );
}

export function ProfilePageBody(props: ProfilePageBodyProps) {
  if (props.section === 'reviews') {
    return <ReviewsProfileBody {...props} />;
  }
  return <TripsProfileBody {...props} />;
}
