import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { escapeHtml } from '@/app/service/email/_lib/sanitize-email-value';
import type { EmailTemplateId, EmailTemplateVars } from '@/app/service/email/types';

const TEMPLATES_DIR = join(process.cwd(), 'src/app/service/email/templates');

/**
 * Loads an HTML/text template and replaces `{{key}}` placeholders.
 * HTML values are entity-escaped; plain-text templates are not.
 */
export function renderEmailTemplate<T extends EmailTemplateId>(
  templateId: T,
  vars: EmailTemplateVars[T],
  extension: 'html' | 'txt' = 'html'
): string {
  const filePath = join(TEMPLATES_DIR, `${templateId}.${extension}`);
  const source = readFileSync(filePath, 'utf8');
  return interpolate(source, vars as Record<string, string>, extension === 'html');
}

function interpolate(
  source: string,
  vars: Record<string, string>,
  htmlEscape: boolean
): string {
  return source.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = vars[key] ?? '';
    return htmlEscape ? escapeHtml(value) : value;
  });
}
