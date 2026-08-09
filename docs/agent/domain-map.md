# Wayboxd Domain Map

Reference for agents working in this codebase. For schema details, read `prisma/schema.prisma`.

## Overview

Wayboxd is a Next.js 16 app (App Router, React 19) with PostgreSQL via Prisma and NextAuth credentials auth.

## Core domains

### Users & auth

```
User (users)
  ├── email (unique)
  ├── name
  ├── password (bcrypt hash — never exposed in API models)
  └── timestamps (createdAt, updatedAt)
```

**Services:** `src/app/service/user/user-service.ts`

**Client:** `src/app/api/client/user-service-client.ts` (`userSignupClient`)

**Auth:** `src/app/api/(controller)/auth/[...nextauth]/options.ts`

**Public signup:** `POST /api/public/user-signup`

## API layout

| Path             | Auth             | Purpose                         |
| ---------------- | ---------------- | ------------------------------- |
| `/api/public/*`  | None             | Public endpoints (signup, etc.) |
| `/api/auth/*`    | NextAuth         | Session login/logout            |
| `/api/*` (other) | Session required | Protected APIs (`src/proxy.ts`) |

## Project layout

```
src/app/
  ├── _util/                 # password helpers
  ├── api/
  │   ├── (controller)/      # route handlers
  │   ├── client/            # browser fetch wrappers (*-service-client.ts)
  │   └── model/             # request/response types
  └── service/               # business logic + prisma
src/proxy.ts                 # auth proxy matcher
prisma/                      # schema + migrations
```

## Conventions

- Route handlers validate input and catch errors
- Services own Prisma access and entity-to-model mapping
- Response models omit sensitive fields (password)
- Use `createApiResponse` for all API JSON responses
