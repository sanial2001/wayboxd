import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';
import { UserModel } from '@/app/api/model/response/user-model';
import { getServerSession } from 'next-auth';

export async function getAuthenticatedUser(): Promise<{
  loggedInUserId: number | null;
  loggedInUserDetails: UserModel | null;
}> {
  const session = await getServerSession(authOptions);

  return {
    loggedInUserId: session?.userDetails?.id ?? null,
    loggedInUserDetails: session?.userDetails ?? null,
  };
}
