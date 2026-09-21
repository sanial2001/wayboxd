export function formatTripMonthYear(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
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

export const TRIP_MONTH_OPTIONS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const;

export function listTripYears(referenceYear = new Date().getFullYear()): number[] {
  const years: number[] = [];
  for (let year = referenceYear + 1; year >= referenceYear - 40; year -= 1) {
    years.push(year);
  }
  return years;
}

export function composeTripMonthValue(year: string, month: string): string | null {
  if (!year || !month) {
    return null;
  }
  return monthInputToIsoTripDate(`${year}-${month}`);
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

export function splitTripMonthYear(value: Date | string | null | undefined): {
  year: string;
  month: string;
} {
  const monthInput = isoToMonthInput(value);
  if (!monthInput) {
    return { year: String(new Date().getFullYear()), month: '' };
  }
  const [year, month] = monthInput.split('-');
  return { year, month };
}

export function isRemoteHttpUrl(url: string): boolean {
  return url.startsWith('https://') || url.startsWith('http://');
}
