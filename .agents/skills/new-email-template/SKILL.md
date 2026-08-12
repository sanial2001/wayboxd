---
name: new-email-template
description: Add a transactional email template under the Wayboxd email service. Use when creating welcome, reset, verify, or other outbound email templates.
---

# New Email Template

Transactional email lives under `src/app/service/email/`. Templates stay provider-agnostic; the sender (Resend, etc.) is wired later via `email-service.ts`.

## Directory structure

```
src/app/service/email/
  ├── email-service.ts              # buildXEmail() builders (+ send later)
  ├── types.ts                      # EmailTemplateId, vars, RenderedEmail
  ├── _lib/
  │   ├── email-tokens.ts           # brand hex tokens for emails
  │   └── render-email-template.ts  # {{placeholder}} renderer
  └── templates/
      ├── <template-id>.html        # canonical HTML (table layout, inline CSS)
      ├── <template-id>.txt         # plain-text alternative
      └── previews/
          └── <template-id>.preview.html  # browser preview with sample data
```

## Steps

1. Choose a kebab-case `template-id` (e.g. `welcome-signup`, `password-reset`).
2. Add `templates/<id>.html` and `templates/<id>.txt` with `{{var}}` placeholders only.
3. Extend `EmailTemplateId` and `EmailTemplateVars` in `types.ts`.
4. Add `buildXEmail(input)` in `email-service.ts` that returns `RenderedEmail` (`subject`, `preheader`, `html`, `text`).
5. Add `templates/previews/<id>.preview.html` filled with sample data for visual review.
6. Match WayBoxd theme: paper/ink/lime, chunky borders, stamp motifs — see locked welcome design (Option A scrapbook).
7. Do **not** put Resend/API keys or route handlers inside `templates/`.

## Rules

- No try-catch in `email-service` builders (same as other services).
- Keep HTML email-client safe: tables, inline styles, system/Georgia fonts.
- Always ship a `.txt` alternative alongside `.html`.
- Sanitize user-controlled values: HTML escape in `renderEmailTemplate` (html mode), `sanitizeEmailText` for subjects, `sanitizeEmailHttpUrl` for CTA links.
- Signup/welcome sends must not fail the user-facing API if transport errors later — handle that in the route when wiring the provider.
- Do not dump templates at repo root (`emails/`) — canonical home is `src/app/service/email/templates/`.

## Design reference

Locked welcome email: scrapbook arrival (Option A) — subject `Passport stamped. You’re in, {name}.`
