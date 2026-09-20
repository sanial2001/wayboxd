export function formatTripMonthYear(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}

export function formatTripBadge(
  tag: string | null | undefined,
  duration: string | null | undefined
): string | null {
  const parts = [tag?.trim(), duration?.trim()].filter((part): part is string =>
    Boolean(part && part.length > 0)
  );
  if (parts.length === 0) {
    return null;
  }
  return parts.join(' · ').toUpperCase();
}

export function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function monthInputToIsoTripDate(monthValue: string): string | null {
  if (!/^\d{4}-\d{2}$/.test(monthValue)) {
    return null;
  }
  return `${monthValue}-01T00:00:00.000Z`;
}

export function isoToMonthInput(value: Date | string | null | undefined): string {
  if (!value) {
    return '';
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function isRemoteHttpUrl(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('http://');
}
