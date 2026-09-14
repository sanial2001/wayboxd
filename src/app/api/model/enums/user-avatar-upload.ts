/** Max size allowed on Blob upload token (after client compression). */
export const USER_AVATAR_MAX_BYTES = 2 * 1024 * 1024;

/** Max size of the original file before client-side compression. */
export const USER_AVATAR_MAX_SOURCE_BYTES = 10 * 1024 * 1024;

export const USER_AVATAR_MAX_LONG_EDGE_PX = 1024;

export const USER_AVATAR_COMPRESS_QUALITY = 0.85;

export const USER_AVATAR_ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type UserAvatarAllowedContentType = (typeof USER_AVATAR_ALLOWED_CONTENT_TYPES)[number];

export function isUserAvatarAllowedContentType(
  contentType: string
): contentType is UserAvatarAllowedContentType {
  return (USER_AVATAR_ALLOWED_CONTENT_TYPES as readonly string[]).includes(contentType);
}
