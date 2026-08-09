<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

Instructions for Cursor Cloud Agents and automated environments.

## Overview

Wayboxd is a Next.js 16 (App Router, React 19) app with PostgreSQL via Prisma ORM and NextAuth credentials auth.

**Coding standards** are in `.cursor/rules/`. **Workflows** are in `.agents/skills/`. **Domain context** is in `docs/agent/domain-map.md`.

## Key commands

| Task                 | Command                            |
| -------------------- | ---------------------------------- |
| Dev server           | `npm run dev`                      |
| Lint                 | `npm run lint`                     |
| Format               | `npm run format`                   |
| Prisma generate      | `npm run prisma:generate`          |
| Prisma migrate (dev) | `npm run prisma:migrate -- <name>` |
| Prisma deploy        | `npm run prisma:deploy`            |

## Gotchas

- Before every commit, run `npm run lint` and `npm run format:check` if you skipped hooks.
- `prisma.config.ts` loads `.env.local` then `.env` — ensure `DATABASE_URL` is set for Prisma CLI.
- Husky pre-commit runs `lint-staged` (Prettier on staged files only; fixes are re-staged into the commit).
- Husky pre-push runs `npm run build`.
- Public API routes must live under `src/app/api/(controller)/public/` to bypass auth in `src/proxy.ts`.
- Auth uses NextAuth at `/api/auth/*`; proxy matcher excludes `public` and `auth`.
