import { UserSignupRequest } from '@/app/api/model/request/user-signup-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { getUserByUsername, saveUser } from '@/app/service/user/user-service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body: UserSignupRequest = await req.json();

    const validationError = validateSignupRequest(body);
    if (validationError) {
      return createApiResponse({
        error: validationError,
        status: 400,
      });
    }

    const existingUsername = await getUserByUsername(body.username.trim());
    if (existingUsername) {
      return createApiResponse({
        error: 'Username already exists',
        status: 400,
      });
    }

    const user = await saveUser(createPartialUser(body));
    return createApiResponse({
      data: user,
      status: 201,
    });
  } catch (error) {
    return createApiResponse({
      error: 'Failed to sign up',
      status: 500,
    });
  }
}

function validateSignupRequest(body: UserSignupRequest): string | null {
  if (!body || typeof body !== 'object') {
    return 'Invalid request body';
  }
  if (typeof body.email !== 'string' || !body.email.trim()) {
    return 'Email is required';
  }
  if (typeof body.username !== 'string' || !body.username.trim()) {
    return 'Username is required';
  }
  if (typeof body.password !== 'string' || !body.password.trim()) {
    return 'Password is required';
  }
  return null;
}

function createPartialUser(body: UserSignupRequest) {
  return {
    email: body.email?.trim() ?? null,
    username: body.username.trim(),
    password: body.password,
  };
}
