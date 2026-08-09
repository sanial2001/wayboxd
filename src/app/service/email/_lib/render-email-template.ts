import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { EmailTemplateId, EmailTemplateVars } from '@/app/service/email/types';

const TEMPLATES_DIR = join(process.cwd(), 'src/app/service/email/templates');

/**
 * Loads an HTML/text template and replaces `{{key}}` placeholders.
 * Keep templates provider-agnostic; swap this renderer later (Handlebars / React Email)
 * without moving files out of `templates/`.
 */
export function renderEmailTemplate<T extends EmailTemplateId>(
  templateId: T,
  vars: EmailTemplateVars[T],
  extension: 'html' | 'txt' = 'html'
): string {
  const filePath = join(TEMPLATES_DIR, `${templateId}.${extension}`);
  const source = readFileSync(filePath, 'utf8');
  return interpolate(source, vars as Record<string, string>);
}

function interpolate(source: string, vars: Record<string, string>): string {
  return source.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    return vars[key] ?? '';
  });
}
