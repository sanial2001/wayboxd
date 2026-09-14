import { SaveUserProfileBodyRequest } from '@/app/api/model/request/save-user-profile-request';
import { UserSigninRequest } from '@/app/api/model/request/user-signin-request';
import { UserSignupRequest } from '@/app/api/model/request/user-signup-request';
import { ApiResponse } from '@/app/api/model/response/api-response';
import { UserModel } from '@/app/api/model/response/user-model';
import { UserProfileModel } from '@/app/api/model/response/user-profile-model';

export async function userSignupClient(
  userSignupRequest: UserSignupRequest
): Promise<ApiResponse<UserModel>> {
  try {
    const response = await fetch('/api/public/user-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSignupRequest),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function userSigninClient(
  userSigninRequest: UserSigninRequest
): Promise<ApiResponse<UserModel>> {
  try {
    const response = await fetch('/api/public/user-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSigninRequest),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function saveUserProfileClient(
  request: SaveUserProfileBodyRequest
): Promise<ApiResponse<UserProfileModel>> {
  const response = await fetch('/api/user/profile/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}
