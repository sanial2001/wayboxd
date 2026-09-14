const AVATAR_PATH_PREFIX = 'avatars';

export function buildAvatarUploadPathname(userId: number, fileName: string): string {
  const safeName = sanitizeAvatarFileName(fileName);
  return `${AVATAR_PATH_PREFIX}/${userId}/${safeName}`;
}

export function validateAvatarUploadPathname(pathname: string, userId: number): string | null {
  const expectedPrefix = `${AVATAR_PATH_PREFIX}/${userId}/`;
  if (!pathname.startsWith(expectedPrefix)) {
    return 'Invalid avatar upload path';
  }

  const remainder = pathname.slice(expectedPrefix.length);
  if (!remainder || remainder.includes('..') || remainder.includes('/')) {
    return 'Invalid avatar upload path';
  }

  return null;
}

function sanitizeAvatarFileName(fileName: string): string {
  const baseName = fileName.split(/[/\\]/).pop()?.trim() ?? 'avatar';
  const sanitized = baseName.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '');
  return sanitized.length > 0 ? sanitized : 'avatar';
}
