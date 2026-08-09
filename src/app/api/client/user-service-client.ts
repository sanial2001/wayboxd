import { UserSignupRequest } from '@/app/api/model/request/user-signup-request';
import { ApiResponse } from '@/app/api/model/response/api-response';
import { UserModel } from '@/app/api/model/response/user-model';

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
