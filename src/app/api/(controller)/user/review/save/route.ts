import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { validatePlaceExists } from '@/app/api/(controller)/user/trip/_validate/existing-place-id';
import { validateSaveReviewBody } from '@/app/api/(controller)/user/review/save/_validate/save-review-body';
import { SaveReviewBodyRequest } from '@/app/api/model/request/save-review-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { getReviewByUserIdAndPlaceId, saveReview } from '@/app/service/review/review-service';
import { Prisma } from '@prisma/client';
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

    const placeError = await validatePlaceExists(validation.body.placeId);
    if (placeError) {
      return createApiResponse({
        error: placeError,
        status: 400,
      });
    }

    const existing = await getReviewByUserIdAndPlaceId(auth.userId, validation.body.placeId);
    if (existing) {
      return createApiResponse({
        error: 'You already reviewed this place',
        status: 400,
      });
    }

    const review = await saveReview({
      userId: auth.userId,
      ...validation.body,
    });
    if (!review) {
      return createApiResponse({
        error: 'rating must be an integer from 1 to 5',
        status: 400,
      });
    }

    return createApiResponse({
      data: review,
      status: 201,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return createApiResponse({
        error: 'You already reviewed this place',
        status: 400,
      });
    }
    return createApiResponse({
      error: 'Failed to save review',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}
