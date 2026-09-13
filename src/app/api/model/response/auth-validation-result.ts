import { UserModel } from '@/app/api/model/response/user-model';
import { NextResponse } from 'next/server';

export interface AuthValidationSuccess {
  error: null;
  userId: number;
  userDetails: UserModel;
}

export interface AuthValidationFailure {
  error: NextResponse;
  userId: null;
  userDetails: null;
}

export type AuthValidationResult = AuthValidationSuccess | AuthValidationFailure;
