import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { validateAvatarUploadPathname } from '@/app/_util/avatar-upload-path';
import {
  USER_AVATAR_ALLOWED_CONTENT_TYPES,
  USER_AVATAR_MAX_BYTES,
} from '@/app/api/model/enums/user-avatar-upload';
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

        const pathError = validateAvatarUploadPathname(pathname, userId);
        if (pathError) {
          throw new Error(pathError);
        }

        return {
          allowedContentTypes: [...USER_AVATAR_ALLOWED_CONTENT_TYPES],
          maximumSizeInBytes: USER_AVATAR_MAX_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId }),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload avatar';
    const status = message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
