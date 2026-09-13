import { SaveManualPlaceRequest } from '@/app/api/model/request/save-manual-place-request';
import { SavePlaceFromOsmRequest } from '@/app/api/model/request/save-place-from-osm-request';
import { ApiResponse } from '@/app/api/model/response/api-response';
import { ManualPlaceSaveResult } from '@/app/api/model/response/manual-place-save-result';
import { PlaceModel } from '@/app/api/model/response/place-model';
import { PlaceSearchResult } from '@/app/api/model/response/place-search-result';

export async function searchPlacesClient(query: string): Promise<ApiResponse<PlaceSearchResult>> {
  const params = new URLSearchParams({ q: query.trim() });
  const response = await fetch(`/api/place/search?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function saveManualPlaceClient(
  request: SaveManualPlaceRequest
): Promise<ApiResponse<ManualPlaceSaveResult>> {
  const response = await fetch('/api/place/save/manual', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}

export async function savePlaceFromOsmClient(
  request: SavePlaceFromOsmRequest
): Promise<ApiResponse<PlaceModel>> {
  const response = await fetch('/api/place/save/from-osm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}
