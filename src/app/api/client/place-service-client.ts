import { SavePlaceFromOsmRequest } from '@/app/api/model/request/save-place-from-osm-request';
import { ApiResponse } from '@/app/api/model/response/api-response';
import { PlaceModel } from '@/app/api/model/response/place-model';
import { PlaceSearchResult } from '@/app/api/model/response/place-search-result';

export async function searchPlacesClient(query: string): Promise<ApiResponse<PlaceSearchResult>> {
  const params = new URLSearchParams({ q: query.trim() });
  const response = await fetch(`/api/place-search?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function savePlaceFromOsmClient(
  request: SavePlaceFromOsmRequest
): Promise<ApiResponse<PlaceModel>> {
  const response = await fetch('/api/place/from-osm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}
