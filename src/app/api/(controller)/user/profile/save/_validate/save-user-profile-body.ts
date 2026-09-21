import {
  normalizeOptionalText,
  validateOptionalHttpUrl,
} from '@/app/api/(controller)/_validate/optional-http-url';
import { SaveUserProfileBodyRequest } from '@/app/api/model/request/save-user-profile-request';
import { SaveUserProfileBodyValidationResult } from '@/app/api/model/response/save-user-profile-body-validation-result';

const OPTIONAL_TEXT_FIELDS = [
  'displayName',
  'bio',
  'avatarUrl',
  'instagramProfileUrl',
  'xProfileUrl',
  'otherProfileUrl',
] as const;

const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com']);
const X_HOSTS = new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']);

export function validateSaveUserProfileBody(body: unknown): SaveUserProfileBodyValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Invalid request body', body: null };
  }

  const request = body as SaveUserProfileBodyRequest;

  for (const field of OPTIONAL_TEXT_FIELDS) {
    const value = request[field];
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value !== 'string') {
      return { error: `${field} must be a string`, body: null };
    }
  }

  const avatarUrlError = validateOptionalHttpUrl(request.avatarUrl, 'avatarUrl');
  if (avatarUrlError) {
    return { error: avatarUrlError, body: null };
  }

  const instagramError = validateOptionalHttpUrl(
    request.instagramProfileUrl,
    'instagramProfileUrl',
    INSTAGRAM_HOSTS
  );
  if (instagramError) {
    return { error: instagramError, body: null };
  }

  const xError = validateOptionalHttpUrl(request.xProfileUrl, 'xProfileUrl', X_HOSTS);
  if (xError) {
    return { error: xError, body: null };
  }

  const otherError = validateOptionalHttpUrl(request.otherProfileUrl, 'otherProfileUrl');
  if (otherError) {
    return { error: otherError, body: null };
  }

  return {
    error: null,
    body: normalizeSaveUserProfileBodyRequest(request),
  };
}

function normalizeSaveUserProfileBodyRequest(
  body: SaveUserProfileBodyRequest
): SaveUserProfileBodyRequest {
  return {
    ...(body.displayName !== undefined
      ? { displayName: normalizeOptionalText(body.displayName) }
      : {}),
    ...(body.bio !== undefined ? { bio: normalizeOptionalText(body.bio) } : {}),
    ...(body.avatarUrl !== undefined ? { avatarUrl: normalizeOptionalText(body.avatarUrl) } : {}),
    ...(body.instagramProfileUrl !== undefined
      ? { instagramProfileUrl: normalizeOptionalText(body.instagramProfileUrl) }
      : {}),
    ...(body.xProfileUrl !== undefined
      ? { xProfileUrl: normalizeOptionalText(body.xProfileUrl) }
      : {}),
    ...(body.otherProfileUrl !== undefined
      ? { otherProfileUrl: normalizeOptionalText(body.otherProfileUrl) }
      : {}),
  };
}
