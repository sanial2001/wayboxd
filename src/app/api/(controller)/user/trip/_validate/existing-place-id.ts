import { getPlaceById } from '@/app/service/place/place-service';

export async function validatePlaceExists(
  placeId: number | null | undefined
): Promise<string | null> {
  if (placeId == null) {
    return null;
  }
  const place = await getPlaceById(placeId);
  if (!place) {
    return 'placeId does not match a place';
  }
  return null;
}
