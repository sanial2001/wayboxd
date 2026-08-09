/** Escape user-controlled values before inserting into HTML email templates. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strip CR/LF and other ASCII control characters so values are safe in
 * email headers (subject, etc.) and display text.
 */
export function sanitizeEmailText(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim();
}

/** Allow only http(s) URLs for links embedded in email HTML. */
export function sanitizeEmailHttpUrl(value: string): string {
  const trimmed = value.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Invalid email CTA URL');
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Email CTA URL must use http or https');
  }
  return trimmed;
}
