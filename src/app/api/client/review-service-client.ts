import { SaveReviewBodyRequest } from '@/app/api/model/request/save-review-request';
import { ApiResponse } from '@/app/api/model/response/api-response';
import { ReviewModel } from '@/app/api/model/response/review-model';

export async function saveReviewClient(
  request: SaveReviewBodyRequest
): Promise<ApiResponse<ReviewModel>> {
  const response = await fetch('/api/user/review/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}
