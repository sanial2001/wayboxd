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

export function validateOptionalHttpUrl(
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
    const platformLabel =
      field === 'instagramProfileUrl' ? 'Instagram' : field === 'xProfileUrl' ? 'X' : 'profile';
    return `${field} must be a valid ${platformLabel} profile URL`;
  }

  return null;
}

export function normalizeOptionalText(value: string | null | undefined): string | null | undefined {
  return normalizeText(value);
}
