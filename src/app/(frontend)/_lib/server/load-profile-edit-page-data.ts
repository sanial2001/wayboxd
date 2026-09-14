import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import { UserProfileModel } from '@/app/api/model/response/user-profile-model';
import { getUserProfileByUserId } from '@/app/service/user/user-profile-service';

export type ProfileEditPageData = {
  userId: number;
  username: string;
  initialProfile: UserProfileModel | null;
};

/** Server-only: session user + profile for `/settings/profile`. */
export async function loadProfileEditPageData(): Promise<ProfileEditPageData> {
  const session = await getServerSession(authOptions);
  const userDetails = session?.userDetails;

  if (!userDetails?.id) {
    redirect('/?auth=signin');
  }

  const initialProfile = await getUserProfileByUserId(userDetails.id);

  return {
    userId: userDetails.id,
    username: userDetails.username,
    initialProfile,
  };
}
