import {
  normalizeOptionalText,
  validateOptionalHttpUrl,
} from '@/app/api/(controller)/_validate/optional-http-url';
import { TripStatus } from '@/app/api/model/enums/trip-status';
import { SaveDraftTripBodyRequest } from '@/app/api/model/request/save-trip-request';
import { SaveTripBodyValidationResult } from '@/app/api/model/response/save-trip-body-validation-result';

const OPTIONAL_TEXT_FIELDS = ['blurb', 'tag', 'duration'] as const;

export function validateSaveDraftTripBody(body: unknown): SaveTripBodyValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body', body: null };
  }

  const request = body as SaveDraftTripBodyRequest;

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

  let coverImageUrl = '';
  if (request.coverImageUrl !== undefined && request.coverImageUrl !== null) {
    if (typeof request.coverImageUrl !== 'string') {
      return { error: 'coverImageUrl must be a string', body: null };
    }
    const trimmedCover = request.coverImageUrl.trim();
    if (trimmedCover.length > 0) {
      const coverImageUrlError = validateOptionalHttpUrl(trimmedCover, 'coverImageUrl');
      if (coverImageUrlError) {
        return { error: coverImageUrlError, body: null };
      }
      coverImageUrl = trimmedCover;
    }
  }

  let outboundUrl: string | null = null;
  if (request.outboundUrl !== undefined && request.outboundUrl !== null) {
    if (typeof request.outboundUrl !== 'string') {
      return { error: 'outboundUrl must be a string', body: null };
    }
    const trimmedOutbound = request.outboundUrl.trim();
    if (trimmedOutbound.length > 0) {
      const outboundUrlError = validateOptionalHttpUrl(trimmedOutbound, 'outboundUrl');
      if (outboundUrlError) {
        return { error: outboundUrlError, body: null };
      }
      outboundUrl = trimmedOutbound;
    }
  }

  let tripDate = new Date();
  if (request.tripDate !== undefined && request.tripDate !== null) {
    if (typeof request.tripDate !== 'string') {
      return { error: 'tripDate must be a string', body: null };
    }
    const trimmedTripDate = request.tripDate.trim();
    if (trimmedTripDate.length > 0) {
      tripDate = new Date(trimmedTripDate);
      if (Number.isNaN(tripDate.getTime())) {
        return { error: 'tripDate must be a valid date', body: null };
      }
    }
  }

  for (const field of OPTIONAL_TEXT_FIELDS) {
    const value = request[field];
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value !== 'string') {
      return { error: `${field} must be a string`, body: null };
    }
  }

  return {
    error: null,
    body: {
      title,
      coverImageUrl,
      outboundUrl,
      tripDate,
      blurb: normalizeOptionalText(request.blurb) ?? null,
      tag: normalizeOptionalText(request.tag) ?? null,
      duration: normalizeOptionalText(request.duration) ?? null,
      status: TripStatus.DRAFT,
      publishedAt: null,
    },
  };
}
