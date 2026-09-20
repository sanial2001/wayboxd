const TRIP_COVER_PATH_PREFIX = 'trip-covers';

export function buildTripCoverUploadPathname(userId: number, fileName: string): string {
  const safeName = sanitizeTripCoverFileName(fileName);
  return `${TRIP_COVER_PATH_PREFIX}/${userId}/${safeName}`;
}

export function validateTripCoverUploadPathname(pathname: string, userId: number): string | null {
  const expectedPrefix = `${TRIP_COVER_PATH_PREFIX}/${userId}/`;
  if (!pathname.startsWith(expectedPrefix)) {
    return 'Invalid trip cover upload path';
  }

  const remainder = pathname.slice(expectedPrefix.length);
  if (!remainder || remainder.includes('..') || remainder.includes('/')) {
    return 'Invalid trip cover upload path';
  }

  return null;
}

function sanitizeTripCoverFileName(fileName: string): string {
  const baseName = fileName.split(/[/\\]/).pop()?.trim() ?? 'cover';
  const sanitized = baseName.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '');
  return sanitized.length > 0 ? sanitized : 'cover';
}
