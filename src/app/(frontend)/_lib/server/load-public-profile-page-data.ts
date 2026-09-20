import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import { PublicUserProfileView } from '@/app/api/model/response/public-user-profile-view';
import { TripModel } from '@/app/api/model/response/trip-model';
import { getTripsByUserId } from '@/app/service/trip/trip-service';
import { getPublicUserProfileByUsername } from '@/app/service/user/user-profile-service';

export type PublicProfilePageData = {
  profile: PublicUserProfileView;
  isOwnProfile: boolean;
  trips: TripModel[];
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
  const trips = await getTripsByUserId(profile.userId);

  return { profile, isOwnProfile, trips };
}
