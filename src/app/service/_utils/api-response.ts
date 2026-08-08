import { NextResponse } from 'next/server';
import { ApiResponse } from '@/app/api/model/response/api-response';

export function createApiResponse<T>(response: ApiResponse<T>) {
  if (response.error) {
    return NextResponse.json(
      { error: response.error, errorCode: response.errorCode, status: response.status },
      { status: response.status }
    );
  } else {
    return NextResponse.json(
      { data: response.data, status: response.status },
      { status: response.status }
    );
  }
}
