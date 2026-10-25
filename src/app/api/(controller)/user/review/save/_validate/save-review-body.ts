import { REVIEW_BODY_MAX_LENGTH } from '@/app/api/model/enums/review-body';
import { SaveReviewBodyRequest } from '@/app/api/model/request/save-review-request';
import { SaveReviewBodyValidationResult } from '@/app/api/model/response/save-review-body-validation-result';

export function validateSaveReviewBody(body: unknown): SaveReviewBodyValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body', body: null };
  }

  const request = body as SaveReviewBodyRequest;
  if (request.body === undefined || request.body === null) {
    return { error: 'body is required', body: null };
  }
  if (typeof request.body !== 'string') {
    return { error: 'body must be a string', body: null };
  }

  const text = request.body.trim();
  if (text.length === 0) {
    return { error: 'body is required', body: null };
  }
  if (text.length > REVIEW_BODY_MAX_LENGTH) {
    return {
      error: `body must be ${REVIEW_BODY_MAX_LENGTH} characters or fewer`,
      body: null,
    };
  }

  return {
    error: null,
    body: { body: text },
  };
}
