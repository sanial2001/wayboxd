import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { isDeletedTripStatus, TripStatus } from '@/app/api/model/enums/trip-status';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { getTripById, updateTrip } from '@/app/service/trip/trip-service';
import { NextRequest } from 'next/server';

type Params = Promise<{ tripId: string }>;

export async function DELETE(_req: NextRequest, props: { params: Params }) {
  try {
    const auth = await validateAuthAndGetUserId();
    if (auth.error) {
      return auth.error;
    }

    const params = await props.params;
    const tripId = parseTripId(params.tripId);
    if (tripId === null) {
      return createApiResponse({
        error: 'tripId must be a positive integer',
        status: 400,
      });
    }

    const existing = await getTripById(tripId);
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

    if (isDeletedTripStatus(existing.status)) {
      return createApiResponse({
        error: 'Trip is already deleted',
        status: 400,
      });
    }

    const trip = await updateTrip(tripId, { status: TripStatus.DELETED });
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
      error: 'Failed to delete trip',
      errorCode: 'DELETE_ERROR',
      status: 500,
    });
  }
}

function parseTripId(value: string): number | null {
  const tripId = Number.parseInt(value, 10);
  if (!Number.isInteger(tripId) || tripId < 1 || String(tripId) !== value) {
    return null;
  }
  return tripId;
}
