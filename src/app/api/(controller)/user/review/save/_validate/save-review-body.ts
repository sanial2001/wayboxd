import {
  REVIEW_BODY_MAX_LENGTH,
  REVIEW_TAG_MAX_COUNT,
  REVIEW_TAG_MAX_LENGTH,
  REVIEW_TITLE_MAX_LENGTH,
} from '@/app/api/model/enums/review-body';
import { isValidReviewRating } from '@/app/api/model/enums/review-rating';
import { SaveReviewBodyRequest } from '@/app/api/model/request/save-review-request';
import { SaveReviewBodyValidationResult } from '@/app/api/model/response/save-review-body-validation-result';

export function validateSaveReviewBody(body: unknown): SaveReviewBodyValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body', body: null };
  }

  const request = body as SaveReviewBodyRequest;

  if (typeof request.placeId !== 'number' || !Number.isInteger(request.placeId)) {
    return { error: 'placeId must be an integer', body: null };
  }
  if (request.placeId < 1) {
    return { error: 'placeId is required', body: null };
  }

  if (request.title === undefined || request.title === null) {
    return { error: 'title is required', body: null };
  }
  if (typeof request.title !== 'string') {
    return { error: 'title must be a string', body: null };
  }
  const title = request.title.trim();
  if (title.length === 0) {
    return { error: 'title is required', body: null };
  }
  if (title.length > REVIEW_TITLE_MAX_LENGTH) {
    return {
      error: `title must be ${REVIEW_TITLE_MAX_LENGTH} characters or fewer`,
      body: null,
    };
  }

  if (typeof request.rating !== 'number' || !isValidReviewRating(request.rating)) {
    return { error: 'rating must be an integer from 1 to 5', body: null };
  }

  let reviewBody: string | null = null;
  if (request.body !== undefined && request.body !== null) {
    if (typeof request.body !== 'string') {
      return { error: 'body must be a string', body: null };
    }
    const text = request.body.trim();
    if (text.length > REVIEW_BODY_MAX_LENGTH) {
      return {
        error: `body must be ${REVIEW_BODY_MAX_LENGTH} characters or fewer`,
        body: null,
      };
    }
    reviewBody = text.length > 0 ? text : null;
  }

  let wouldGoAgain: boolean | null = null;
  if (request.wouldGoAgain !== undefined && request.wouldGoAgain !== null) {
    if (typeof request.wouldGoAgain !== 'boolean') {
      return { error: 'wouldGoAgain must be a boolean', body: null };
    }
    wouldGoAgain = request.wouldGoAgain;
  }

  let visitDate: Date | null = null;
  if (request.visitDate !== undefined && request.visitDate !== null) {
    if (typeof request.visitDate !== 'string') {
      return { error: 'visitDate must be a string', body: null };
    }
    const trimmedVisitDate = request.visitDate.trim();
    if (trimmedVisitDate.length > 0) {
      const parsed = new Date(trimmedVisitDate);
      if (Number.isNaN(parsed.getTime())) {
        return { error: 'visitDate must be a valid date', body: null };
      }
      visitDate = parsed;
    }
  }

  const tagsResult = readTags(request.tags);
  if (tagsResult.error) {
    return { error: tagsResult.error, body: null };
  }

  return {
    error: null,
    body: {
      placeId: request.placeId,
      title,
      rating: request.rating,
      body: reviewBody,
      wouldGoAgain,
      visitDate,
      tags: tagsResult.tags,
    },
  };
}

function readTags(value: unknown): { error: string | null; tags: string[] } {
  if (value === undefined || value === null) {
    return { error: null, tags: [] };
  }
  if (!Array.isArray(value)) {
    return { error: 'tags must be an array of strings', tags: [] };
  }
  if (value.length > REVIEW_TAG_MAX_COUNT) {
    return { error: `tags must include at most ${REVIEW_TAG_MAX_COUNT} items`, tags: [] };
  }

  const tags: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item !== 'string') {
      return { error: 'tags must be an array of strings', tags: [] };
    }
    const tag = item.trim();
    if (tag.length === 0) {
      continue;
    }
    if (tag.length > REVIEW_TAG_MAX_LENGTH) {
      return {
        error: `each tag must be ${REVIEW_TAG_MAX_LENGTH} characters or fewer`,
        tags: [],
      };
    }
    const key = tag.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    tags.push(tag);
  }

  return { error: null, tags };
}
