import { UserSignupRequest } from '@/app/api/model/request/user-signup-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { saveUser } from '@/app/service/user/user-service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body: UserSignupRequest = await req.json();
    const partialUser = createPartialUser(body);
    const user = await saveUser(partialUser);
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

function createPartialUser(body: UserSignupRequest) {
  return {
    email: body.email,
    name: body.name,
    password: body.password,
  };
}
