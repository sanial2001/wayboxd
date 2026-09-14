import { validateAuthAndGetUserId } from '@/app/api/(controller)/_util/validate';
import { SaveUserProfileBodyRequest } from '@/app/api/model/request/save-user-profile-request';
import { createApiResponse } from '@/app/service/_utils/api-response';
import {
  getUserProfileByUserId,
  saveUserProfile,
  updateUserProfile,
} from '@/app/service/user/user-profile-service';
import { NextRequest } from 'next/server';

const OPTIONAL_TEXT_FIELDS = [
  'displayName',
  'bio',
  'avatarUrl',
  'instagramProfileUrl',
  'xProfileUrl',
] as const;

const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com']);
const X_HOSTS = new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']);

export async function POST(req: NextRequest) {
  try {
    const auth = await validateAuthAndGetUserId();
    if (auth.error) {
      return auth.error;
    }

    const body: SaveUserProfileBodyRequest = await req.json();
    const validationError = validateSaveUserProfileBodyRequest(body);
    if (validationError) {
      return createApiResponse({
        error: validationError,
        status: 400,
      });
    }

    const normalized = normalizeSaveUserProfileBodyRequest(body);
    const existing = await getUserProfileByUserId(auth.userId);

    if (existing) {
      const profile = await updateUserProfile(auth.userId, normalized);
      if (!profile) {
        return createApiResponse({
          error: 'Failed to save user profile',
          status: 500,
        });
      }
      return createApiResponse({
        data: profile,
        status: 200,
      });
    }

    const profile = await saveUserProfile({
      userId: auth.userId,
      ...normalized,
    });

    return createApiResponse({
      data: profile,
      status: 201,
    });
  } catch {
    return createApiResponse({
      error: 'Failed to save user profile',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}

function validateSaveUserProfileBodyRequest(body: SaveUserProfileBodyRequest): string | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Invalid request body';
  }

  for (const field of OPTIONAL_TEXT_FIELDS) {
    const value = body[field];
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value !== 'string') {
      return `${field} must be a string`;
    }
  }

  const avatarUrlError = validateOptionalHttpUrl(body.avatarUrl, 'avatarUrl');
  if (avatarUrlError) {
    return avatarUrlError;
  }

  const instagramError = validateOptionalHttpUrl(
    body.instagramProfileUrl,
    'instagramProfileUrl',
    INSTAGRAM_HOSTS
  );
  if (instagramError) {
    return instagramError;
  }

  const xError = validateOptionalHttpUrl(body.xProfileUrl, 'xProfileUrl', X_HOSTS);
  if (xError) {
    return xError;
  }

  return null;
}

function normalizeSaveUserProfileBodyRequest(
  body: SaveUserProfileBodyRequest
): SaveUserProfileBodyRequest {
  return {
    ...(body.displayName !== undefined ? { displayName: normalizeText(body.displayName) } : {}),
    ...(body.bio !== undefined ? { bio: normalizeText(body.bio) } : {}),
    ...(body.avatarUrl !== undefined ? { avatarUrl: normalizeText(body.avatarUrl) } : {}),
    ...(body.instagramProfileUrl !== undefined
      ? { instagramProfileUrl: normalizeText(body.instagramProfileUrl) }
      : {}),
    ...(body.xProfileUrl !== undefined ? { xProfileUrl: normalizeText(body.xProfileUrl) } : {}),
  };
}

function normalizeText(value: string | null | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function validateOptionalHttpUrl(
  value: string | null | undefined,
  field: string,
  allowedHosts?: Set<string>
): string | null {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return `${field} must be a valid URL`;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return `${field} must use http or https`;
  }

  if (allowedHosts && !allowedHosts.has(parsed.hostname.toLowerCase())) {
    return `${field} must be a valid ${field === 'instagramProfileUrl' ? 'Instagram' : 'X'} profile URL`;
  }

  return null;
}
