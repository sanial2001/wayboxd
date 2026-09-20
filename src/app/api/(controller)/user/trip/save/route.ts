import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { validateSaveTripBody } from '@/app/api/(controller)/user/trip/save/_validate/save-trip-body';
import { SaveTripBodyRequest } from '@/app/api/model/request/save-trip-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { saveTrip } from '@/app/service/trip/trip-service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const auth = await validateAuthAndGetUserId();
    if (auth.error) {
      return auth.error;
    }

    const body: SaveTripBodyRequest = await req.json();
    const validation = validateSaveTripBody(body);
    if (validation.error !== null) {
      return createApiResponse({
        error: validation.error,
        status: 400,
      });
    }

    const trip = await saveTrip({
      userId: auth.userId,
      ...validation.body,
    });

    return createApiResponse({
      data: trip,
      status: 201,
    });
  } catch {
    return createApiResponse({
      error: 'Failed to save trip',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}
