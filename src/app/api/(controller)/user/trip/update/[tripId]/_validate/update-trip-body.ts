import {
  normalizeOptionalText,
  validateOptionalHttpUrl,
} from '@/app/api/(controller)/_validate/optional-http-url';
import { getTripStatusFromString, TripStatus } from '@/app/api/model/enums/trip-status';
import { UpdateTripBodyRequest } from '@/app/api/model/request/update-trip-request';
import {
  UpdateTripBodyValidationResult,
  UpdateTripValidatedBody,
} from '@/app/api/model/response/update-trip-body-validation-result';

const OPTIONAL_TEXT_FIELDS = ['blurb', 'tag', 'duration'] as const;
const PUBLISH_REQUIRED_FIELDS = ['title', 'coverImageUrl', 'tripDate'] as const;

export function validateUpdateTripBody(body: unknown): UpdateTripBodyValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body', body: null };
  }

  const request = body as UpdateTripBodyRequest;
  const patch: UpdateTripValidatedBody = {};

  if (request.title !== undefined) {
    if (request.title === null || typeof request.title !== 'string') {
      return { error: 'title must be a string', body: null };
    }
    const title = request.title.trim();
    if (title.length === 0) {
      return { error: 'title is required', body: null };
    }
    patch.title = title;
  }

  if (request.coverImageUrl !== undefined) {
    const coverImageUrlError = validateRequiredHttpUrl(request.coverImageUrl, 'coverImageUrl');
    if (coverImageUrlError) {
      return { error: coverImageUrlError, body: null };
    }
    if (typeof request.coverImageUrl !== 'string') {
      return { error: 'coverImageUrl must be a string', body: null };
    }
    patch.coverImageUrl = request.coverImageUrl.trim();
  }

  if (request.outboundUrl !== undefined) {
    if (request.outboundUrl !== null && typeof request.outboundUrl !== 'string') {
      return { error: 'outboundUrl must be a string', body: null };
    }
    if (request.outboundUrl === null || request.outboundUrl.trim().length === 0) {
      patch.outboundUrl = '';
    } else {
      const outboundUrlError = validateOptionalHttpUrl(request.outboundUrl, 'outboundUrl');
      if (outboundUrlError) {
        return { error: outboundUrlError, body: null };
      }
      patch.outboundUrl = request.outboundUrl.trim();
    }
  }

  if (request.tripDate !== undefined) {
    if (request.tripDate === null || typeof request.tripDate !== 'string') {
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
    patch.tripDate = tripDate;
  }

  for (const field of OPTIONAL_TEXT_FIELDS) {
    const value = request[field];
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value !== 'string') {
      return { error: `${field} must be a string`, body: null };
    }
    patch[field] = normalizeOptionalText(value) ?? null;
  }

  if (request.status !== undefined) {
    if (request.status === null || typeof request.status !== 'string') {
      return { error: 'status must be a string', body: null };
    }
    const status = getTripStatusFromString(request.status);
    if (!status) {
      return { error: 'status is invalid', body: null };
    }
    if (status === TripStatus.DELETED) {
      return { error: 'status cannot be Deleted', body: null };
    }
    patch.status = status;
  }

  if (Object.keys(patch).length === 0) {
    return { error: 'At least one field is required', body: null };
  }

  if (patch.status === TripStatus.PUBLISHED) {
    for (const field of PUBLISH_REQUIRED_FIELDS) {
      if (patch[field] === undefined) {
        return { error: `${field} is required`, body: null };
      }
    }
  }

  return { error: null, body: patch };
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
