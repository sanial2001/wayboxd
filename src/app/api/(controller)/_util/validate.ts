import { getAuthenticatedUser } from '@/app/api/(controller)/_util/auth';
import { AuthValidationResult } from '@/app/api/model/response/auth-validation-result';
import { createApiResponse } from '@/app/service/_utils/api-response';

export async function validateAuthAndGetUserId(): Promise<AuthValidationResult> {
  const { loggedInUserId, loggedInUserDetails } = await getAuthenticatedUser();

  if (!loggedInUserId || !loggedInUserDetails) {
    return {
      error: createApiResponse({
        error: 'Unauthorized',
        errorCode: 'UNAUTHORIZED',
        status: 401,
      }),
      userId: null,
      userDetails: null,
    };
  }

  return {
    error: null,
    userId: loggedInUserId,
    userDetails: loggedInUserDetails,
  };
}
