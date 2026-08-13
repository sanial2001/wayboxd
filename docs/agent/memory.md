# Agent Memory

Team-maintained notes for Cursor agents. Update this file when you learn something that should persist across sessions.

## Decisions

- Business logic belongs in `src/app/service/`, not in route handlers or page components.
- Public API routes live under `src/app/api/(controller)/public/` and are excluded from auth in `src/proxy.ts`.
- Protected API routes rely on `src/proxy.ts` (`withAuth`) — matcher excludes `public` and `auth`.
- Coding standards live in `.cursor/rules/`; workflows live in `.agents/skills/`.
- Use `createApiResponse` from `@/app/service/_utils/api-response` for all API JSON responses.
- UI code calls APIs via `src/app/api/client/*-service-client.ts`, not inline `fetch` in components.
- Transactional email templates live under `src/app/service/email/templates/` (not repo-root dumps). Builders in `email-service.ts`; provider transport (Resend planned) stays out of template files.
- Welcome signup email design is locked to scrapbook Option A (`welcome-signup`); theme tokens in `email/_lib/email-tokens.ts`.

## Gotchas

- `prisma.config.ts` loads `.env.local` then `.env` — ensure `DATABASE_URL` is set for migrations.
- `npm run dev` runs `prisma generate` then `next dev`.
- Husky pre-commit runs `lint-staged` (Prettier on staged files, auto-re-staged). Do not use `npm run format` in the hook — that formats the whole tree and leaves unstaged changes behind.
- Husky pre-push runs `npm run build`.
- Next.js 16 uses `proxy.ts` (not `middleware.ts`) for request proxy/auth.
- Password hashes must never appear in `UserModel` or public API responses.

## Do not repeat

- Do not add try-catch in service layer functions.
- Do not return raw `NextResponse.json` from API routes — use `createApiResponse`.
- Do not put Prisma queries in route handlers — use the entity's service file.
- Do not call `fetch('/api/...')` directly in UI components — add a function to `src/app/api/client/`.
- Do not expose `password` from service mappers used by public/protected API routes.
- Do not add email HTML under a top-level `emails/` folder — use `src/app/service/email/templates/`.
- Never interpolate raw user input into email HTML/subjects — use `sanitizeEmailText` / HTML escaping in `render-email-template` / `sanitizeEmailHttpUrl`.
