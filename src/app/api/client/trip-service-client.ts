import { SaveTripBodyRequest } from '@/app/api/model/request/save-trip-request';
import { ApiResponse } from '@/app/api/model/response/api-response';
import { TripModel } from '@/app/api/model/response/trip-model';

export async function saveTripClient(
  request: SaveTripBodyRequest
): Promise<ApiResponse<TripModel>> {
  const response = await fetch('/api/user/trip/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}
