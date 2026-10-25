import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import { PublicUserProfileView } from '@/app/api/model/response/public-user-profile-view';
import { ReviewModel } from '@/app/api/model/response/review-model';
import { TripModel } from '@/app/api/model/response/trip-model';
import { countReviewsByUserId, getReviewsByUserId } from '@/app/service/review/review-service';
import {
  countPublishedTripsByUserId,
  getDraftTripsByUserId,
  getPublishedTripsByUserId,
} from '@/app/service/trip/trip-service';
import { getPublicUserProfileByUsername } from '@/app/service/user/user-profile-service';

export type PublicProfilePageData = {
  profile: PublicUserProfileView;
  isOwnProfile: boolean;
  trips: TripModel[];
  drafts: TripModel[];
  reviewCount: number;
};

export type PublicProfileReviewsPageData = {
  profile: PublicUserProfileView;
  isOwnProfile: boolean;
  reviews: ReviewModel[];
  tripCount: number;
};

/** Server-only: public profile by username + whether the viewer owns it. */
export async function loadPublicProfilePageData(
  username: string
): Promise<PublicProfilePageData | null> {
  const profile = await getPublicUserProfileByUsername(username);
  if (!profile) {
    return null;
  }

  const session = await getServerSession(authOptions);
  const isOwnProfile = session?.userDetails?.id === profile.userId;
  const [trips, drafts, reviewCount] = await Promise.all([
    getPublishedTripsByUserId(profile.userId),
    isOwnProfile ? getDraftTripsByUserId(profile.userId) : Promise.resolve([]),
    countReviewsByUserId(profile.userId),
  ]);

  return { profile, isOwnProfile, trips, drafts, reviewCount };
}

/** Server-only: the same profile shell, with that user's reviews. */
export async function loadPublicProfileReviewsPageData(
  username: string
): Promise<PublicProfileReviewsPageData | null> {
  const profile = await getPublicUserProfileByUsername(username);
  if (!profile) {
    return null;
  }

  const session = await getServerSession(authOptions);
  const isOwnProfile = session?.userDetails?.id === profile.userId;
  const [reviews, tripCount] = await Promise.all([
    getReviewsByUserId(profile.userId),
    countPublishedTripsByUserId(profile.userId),
  ]);

  return { profile, isOwnProfile, reviews, tripCount };
}
