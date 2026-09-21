import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { validateUpdateTripBody } from '@/app/api/(controller)/user/trip/update/_validate/update-trip-body';
import { UpdateTripBodyRequest } from '@/app/api/model/request/update-trip-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { getTripById, updateTrip } from '@/app/service/trip/trip-service';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const auth = await validateAuthAndGetUserId();
    if (auth.error) {
      return auth.error;
    }

    const body: UpdateTripBodyRequest = await req.json();
    const validation = validateUpdateTripBody(body);
    if (validation.error !== null) {
      return createApiResponse({
        error: validation.error,
        status: 400,
      });
    }

    const existing = await getTripById(validation.body.id);
    if (!existing) {
      return createApiResponse({
        error: 'Trip not found',
        status: 404,
      });
    }

    if (existing.userId !== auth.userId) {
      return createApiResponse({
        error: 'Forbidden',
        status: 403,
      });
    }

    const { id, ...patch } = validation.body;
    const trip = await updateTrip(id, patch);
    if (!trip) {
      return createApiResponse({
        error: 'Trip not found',
        status: 404,
      });
    }

    return createApiResponse({
      data: trip,
      status: 200,
    });
  } catch {
    return createApiResponse({
      error: 'Failed to update trip',
      errorCode: 'PUT_ERROR',
      status: 500,
    });
  }
}
