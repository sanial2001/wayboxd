import { UserSigninRequest } from '@/app/api/model/request/user-signin-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { authenticateUser } from '@/app/service/user/user-service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body: UserSigninRequest = await req.json();

    const validationError = validateSigninRequest(body);
    if (validationError) {
      return createApiResponse({
        error: validationError,
        status: 400,
      });
    }

    const user = await authenticateUser(body.username.trim(), body.password);
    if (!user) {
      return createApiResponse({
        error: 'Invalid username or password',
        status: 401,
      });
    }

    return createApiResponse({
      data: user,
      status: 200,
    });
  } catch {
    return createApiResponse({
      error: 'Failed to sign in',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}

function validateSigninRequest(body: UserSigninRequest): string | null {
  if (!body || typeof body !== 'object') {
    return 'Invalid request body';
  }
  if (typeof body.username !== 'string' || !body.username.trim()) {
    return 'Username is required';
  }
  if (typeof body.password !== 'string' || !body.password.trim()) {
    return 'Password is required';
  }
  return null;
}
