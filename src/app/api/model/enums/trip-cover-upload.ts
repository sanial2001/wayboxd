/** Max size allowed on Blob upload token (after client compression). */
export const TRIP_COVER_MAX_BYTES = 2 * 1024 * 1024;

/** Max size of the original file before client-side compression. */
export const TRIP_COVER_MAX_SOURCE_BYTES = 10 * 1024 * 1024;

export const TRIP_COVER_MAX_LONG_EDGE_PX = 1920;

export const TRIP_COVER_COMPRESS_QUALITY = 0.85;

export const TRIP_COVER_ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type TripCoverAllowedContentType = (typeof TRIP_COVER_ALLOWED_CONTENT_TYPES)[number];

export function isTripCoverAllowedContentType(
  contentType: string
): contentType is TripCoverAllowedContentType {
  return (TRIP_COVER_ALLOWED_CONTENT_TYPES as readonly string[]).includes(contentType);
}
