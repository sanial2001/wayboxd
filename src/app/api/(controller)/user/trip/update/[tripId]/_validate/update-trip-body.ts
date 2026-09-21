import {
  normalizeOptionalText,
  validateOptionalHttpUrl,
} from '@/app/api/(controller)/_validate/optional-http-url';
import { UpdateTripBodyRequest } from '@/app/api/model/request/update-trip-request';
import {
  UpdateTripBodyValidationResult,
  UpdateTripValidatedBody,
} from '@/app/api/model/response/update-trip-body-validation-result';

export function validateUpdateTripBody(body: unknown): UpdateTripBodyValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body', body: null };
  }

  const request = body as UpdateTripBodyRequest;

  const hasTitle = request.title !== undefined;
  const hasBlurb = request.blurb !== undefined;
  const hasOutboundUrl = request.outboundUrl !== undefined;

  if (!hasTitle && !hasBlurb && !hasOutboundUrl) {
    return { error: 'At least one of title, blurb, or outboundUrl is required', body: null };
  }

  const patch: UpdateTripValidatedBody = {};

  if (hasTitle) {
    if (request.title === null || typeof request.title !== 'string') {
      return { error: 'title must be a string', body: null };
    }
    const title = request.title.trim();
    if (title.length === 0) {
      return { error: 'title is required', body: null };
    }
    patch.title = title;
  }

  if (hasBlurb) {
    if (request.blurb !== null && typeof request.blurb !== 'string') {
      return { error: 'blurb must be a string', body: null };
    }
    patch.blurb = normalizeOptionalText(request.blurb) ?? null;
  }

  if (hasOutboundUrl) {
    const outboundUrlError = validateRequiredHttpUrl(request.outboundUrl, 'outboundUrl');
    if (outboundUrlError) {
      return { error: outboundUrlError, body: null };
    }
    if (typeof request.outboundUrl !== 'string') {
      return { error: 'outboundUrl must be a string', body: null };
    }
    patch.outboundUrl = request.outboundUrl.trim();
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
