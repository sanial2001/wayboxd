import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { validateTripCoverUploadPathname } from '@/app/_util/trip-cover-upload-path';
import {
  TRIP_COVER_ALLOWED_CONTENT_TYPES,
  TRIP_COVER_MAX_BYTES,
} from '@/app/api/model/enums/trip-cover-upload';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;
    let userId: number | null = null;

    if (body.type === 'blob.generate-client-token') {
      const auth = await validateAuthAndGetUserId();
      if (auth.error) {
        return auth.error;
      }
      userId = auth.userId;
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (userId === null) {
          throw new Error('Unauthorized');
        }

        const pathError = validateTripCoverUploadPathname(pathname, userId);
        if (pathError) {
          throw new Error(pathError);
        }

        return {
          allowedContentTypes: [...TRIP_COVER_ALLOWED_CONTENT_TYPES],
          maximumSizeInBytes: TRIP_COVER_MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId }),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload trip cover';
    const status = message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
