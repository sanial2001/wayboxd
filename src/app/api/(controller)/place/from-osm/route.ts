import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { SavePlaceFromOsmRequest } from '@/app/api/model/request/save-place-from-osm-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { findOrCreatePlaceFromOsmRequest } from '@/app/service/place/place-service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const auth = await validateAuthAndGetUserId();
    if (auth.error) {
      return auth.error;
    }

    const body: SavePlaceFromOsmRequest = await req.json();
    const place = await findOrCreatePlaceFromOsmRequest(body, auth.userId);
    if (!place) {
      return createApiResponse({
        error: 'Failed to save place from OSM',
        status: 400,
      });
    }

    return createApiResponse({
      data: place,
      status: 200,
    });
  } catch {
    return createApiResponse({
      error: 'Failed to save place from OSM',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}
