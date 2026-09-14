import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { SaveUserProfileBodyRequest } from '@/app/api/model/request/save-user-profile-request';
import { validateSaveUserProfileBody } from '@/app/api/(controller)/user/profile/save/_validate/save-user-profile-body';
import { createApiResponse } from '@/app/service/_utils/api-response';
import {
  getUserProfileByUserId,
  saveUserProfile,
  updateUserProfile,
} from '@/app/service/user/user-profile-service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const auth = await validateAuthAndGetUserId();
    if (auth.error) {
      return auth.error;
    }

    const body: SaveUserProfileBodyRequest = await req.json();
    const validation = validateSaveUserProfileBody(body);
    if (validation.error !== null) {
      return createApiResponse({
        error: validation.error,
        status: 400,
      });
    }

    const profileBody = validation.body;
    const existing = await getUserProfileByUserId(auth.userId);

    if (existing) {
      const profile = await updateUserProfile(auth.userId, profileBody);
      if (!profile) {
        return createApiResponse({
          error: 'Failed to save user profile',
          status: 500,
        });
      }
      return createApiResponse({
        data: profile,
        status: 200,
      });
    }

    const profile = await saveUserProfile({
      userId: auth.userId,
      ...profileBody,
    });

    return createApiResponse({
      data: profile,
      status: 201,
    });
  } catch {
    return createApiResponse({
      error: 'Failed to save user profile',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}
