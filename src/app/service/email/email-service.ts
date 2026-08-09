import { renderEmailTemplate } from '@/app/service/email/_lib/render-email-template';
import {
  sanitizeEmailHttpUrl,
  sanitizeEmailText,
} from '@/app/service/email/_lib/sanitize-email-value';
import type { RenderedEmail, WelcomeSignupEmailInput } from '@/app/service/email/types';

/**
 * Builds transactional emails from `templates/`.
 * Provider send (Resend, etc.) should call these builders — keep transport out of templates.
 */
export function buildWelcomeSignupEmail(input: WelcomeSignupEmailInput): RenderedEmail {
  const name = sanitizeEmailText(input.name);
  const ctaUrl = sanitizeEmailHttpUrl(input.ctaUrl);
  const preheader = sanitizeEmailText(
    'Go somewhere. Have an opinion. Your scrapbook is empty — for now.'
  );

  const vars = {
    name,
    ctaUrl,
    preheader,
  };

  return {
    subject: `Passport stamped. You’re in, ${name}.`,
    preheader,
    html: renderEmailTemplate('welcome-signup', vars, 'html'),
    text: renderEmailTemplate('welcome-signup', vars, 'txt'),
  };
}
