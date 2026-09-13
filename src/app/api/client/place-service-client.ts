import { ApiResponse } from '@/app/api/model/response/api-response';
import { PlaceSearchResult } from '@/app/api/model/response/place-search-result';

export async function searchPlacesClient(query: string): Promise<ApiResponse<PlaceSearchResult>> {
  const params = new URLSearchParams({ q: query.trim() });
  const response = await fetch(`/api/public/place-search?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}
