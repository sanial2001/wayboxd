import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { validateSaveReviewBody } from '@/app/api/(controller)/user/review/save/_validate/save-review-body';
import { SaveReviewBodyRequest } from '@/app/api/model/request/save-review-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { saveReview } from '@/app/service/review/review-service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const auth = await validateAuthAndGetUserId();
    if (auth.error) {
      return auth.error;
    }

    const body: SaveReviewBodyRequest = await req.json();
    const validation = validateSaveReviewBody(body);
    if (validation.error !== null) {
      return createApiResponse({
        error: validation.error,
        status: 400,
      });
    }

    const review = await saveReview({
      userId: auth.userId,
      body: validation.body.body,
    });

    return createApiResponse({
      data: review,
      status: 201,
    });
  } catch {
    return createApiResponse({
      error: 'Failed to save review',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}
