import { UserSignupRequest } from '@/app/api/model/request/user-signup-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { getUserByEmail, saveUser } from '@/app/service/user/user-service';
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

    const existingUser = await getUserByEmail(body.email.trim());
    if (existingUser) {
      return createApiResponse({
        error: 'User Email already exists',
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
  if (typeof body.name !== 'string' || !body.name.trim()) {
    return 'Name is required';
  }
  if (typeof body.password !== 'string' || !body.password.trim()) {
    return 'Password is required';
  }
  return null;
}

function createPartialUser(body: UserSignupRequest) {
  return {
    email: body.email.trim(),
    name: body.name.trim(),
    password: body.password,
  };
}
