import { createApiResponse } from '@/app/service/_utils/api-response';
import { searchPlaces } from '@/app/service/place/place-service';
import { NextRequest } from 'next/server';

const MIN_QUERY_LENGTH = 2;

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('q')?.trim() ?? '';

    if (query.length < MIN_QUERY_LENGTH) {
      return createApiResponse({
        error: `Query must be at least ${MIN_QUERY_LENGTH} characters`,
        status: 400,
      });
    }

    const results = await searchPlaces(query);
    return createApiResponse({
      data: results,
      status: 200,
    });
  } catch {
    return createApiResponse({
      error: 'Failed to search places',
      errorCode: 'GET_ERROR',
      status: 500,
    });
  }
}
