import {
  normalizeOptionalText,
  validateOptionalHttpUrl,
} from '@/app/api/(controller)/_validate/optional-http-url';
import { TripStatus } from '@/app/api/model/enums/trip-status';
import { SaveTripBodyRequest } from '@/app/api/model/request/save-trip-request';
import { SaveTripBodyValidationResult } from '@/app/api/model/response/save-trip-body-validation-result';

const OPTIONAL_TEXT_FIELDS = ['blurb', 'tag', 'duration'] as const;

export function validateSaveTripBody(body: unknown): SaveTripBodyValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body', body: null };
  }

  const request = body as SaveTripBodyRequest;

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

  const coverImageUrlError = validateRequiredHttpUrl(request.coverImageUrl, 'coverImageUrl');
  if (coverImageUrlError) {
    return { error: coverImageUrlError, body: null };
  }

  const outboundUrlError = validateRequiredHttpUrl(request.outboundUrl, 'outboundUrl');
  if (outboundUrlError) {
    return { error: outboundUrlError, body: null };
  }

  if (request.tripDate === undefined || request.tripDate === null) {
    return { error: 'tripDate is required', body: null };
  }
  if (typeof request.tripDate !== 'string') {
    return { error: 'tripDate must be a string', body: null };
  }
  const trimmedTripDate = request.tripDate.trim();
  if (trimmedTripDate.length === 0) {
    return { error: 'tripDate is required', body: null };
  }
  const tripDate = new Date(trimmedTripDate);
  if (Number.isNaN(tripDate.getTime())) {
    return { error: 'tripDate must be a valid date', body: null };
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
      coverImageUrl: request.coverImageUrl.trim(),
      outboundUrl: request.outboundUrl.trim(),
      tripDate,
      blurb: normalizeOptionalText(request.blurb) ?? null,
      tag: normalizeOptionalText(request.tag) ?? null,
      duration: normalizeOptionalText(request.duration) ?? null,
      status: TripStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  };
}

function validateRequiredHttpUrl(value: unknown, field: string): string | null {
  if (value === undefined || value === null) {
    return `${field} is required`;
  }
  if (typeof value !== 'string') {
    return `${field} must be a string`;
  }
  if (value.trim().length === 0) {
    return `${field} is required`;
  }
  return validateOptionalHttpUrl(value, field);
}
