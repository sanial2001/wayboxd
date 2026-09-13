import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { SaveManualPlaceRequest } from '@/app/api/model/request/save-manual-place-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { saveManualPlace } from '@/app/service/place/place-service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const auth = await validateAuthAndGetUserId();
    if (auth.error) {
      return auth.error;
    }

    const body: SaveManualPlaceRequest = await req.json();
    const result = await saveManualPlace({
      ...body,
      createdByUserId: auth.userId,
    });

    if (!result) {
      return createApiResponse({
        error: 'Failed to save place',
        status: 400,
      });
    }

    if (result.status === 'duplicate') {
      return createApiResponse({
        data: result,
        status: 409,
      });
    }

    return createApiResponse({
      data: result,
      status: 201,
    });
  } catch {
    return createApiResponse({
      error: 'Failed to save place',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}
