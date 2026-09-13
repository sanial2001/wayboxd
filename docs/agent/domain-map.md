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

**Client:** `src/app/api/client/user-service-client.ts` (`userSignupClient`, `userSigninClient`)

**Auth:** `src/app/api/(controller)/auth/[...nextauth]/options.ts`

**Public signup:** `POST /api/public/user-signup`

**Public sign-in:** `POST /api/public/user-signin`

### Email (transactional)

```
src/app/service/email/
  ├── email-service.ts           # buildWelcomeSignupEmail(), future send*
  ├── types.ts
  ├── _lib/                      # renderer + brand tokens
  └── templates/                 # <id>.html + <id>.txt + previews/
```

**Current templates:** `welcome-signup` (scrapbook Option A)

**Skill:** `.agents/skills/new-email-template/`

### Places

```
Place (places)
  ├── slug (unique)
  ├── name, description, category (string; validated via PlaceCategory enum)
  ├── parentPlaceId → Place (hierarchy, e.g. Solang → Manali)
  ├── city, region, country, lat/lng, address
  ├── coverImageUrl
  ├── createdByUserId → User
  └── timestamps (createdAt, updatedAt)
```

**Enum:** `src/app/api/model/enums/place-category.ts`

**Service:** `src/app/service/place/place-service.ts`

### Reviews

```
Review (reviews)
  ├── userId → User (author)
  ├── placeId → Place
  ├── title, body
  ├── rating (1–5)
  ├── wouldGoAgain, visitDate, tags
  └── timestamps (createdAt, updatedAt)
```

One review per user per place (`@@unique([userId, placeId])`).

**Enum:** `src/app/api/model/enums/review-rating.ts`

**Service:** `src/app/service/review/review-service.ts`

## API layout

| Path                     | Auth             | Purpose                                       |
| ------------------------ | ---------------- | --------------------------------------------- |
| `/api/public/*`          | None             | Public endpoints (signup, sign-in, etc.)      |
| `/api/auth/*`            | NextAuth         | Session login/logout                          |
| `/api/docs/swagger.json` | Session required | OpenAPI spec (404 when `APP_ENV=production`)  |
| `/api-docs`              | Page is public   | Swagger UI (spec fetch still needs a session) |
| `/api/*` (other)         | Session required | Protected APIs (`src/proxy.ts`)               |

Every `route.ts` under a coverage-whitelisted folder needs a sibling `route.docs.ts`. Run `npm run swagger:validate`.

## Project layout

```
src/app/
  ├── _util/                 # password helpers
  ├── api/
  │   ├── (controller)/      # route handlers
  │   ├── client/            # browser fetch wrappers (*-service-client.ts)
  │   └── model/             # request/response types
  └── service/               # business logic + prisma (+ email templates)
src/proxy.ts                 # auth proxy matcher
prisma/                      # schema + migrations
```

## Conventions

- Route handlers validate input and catch errors
- Services own Prisma access and entity-to-model mapping
- Response models omit sensitive fields (password)
- Use `createApiResponse` for all API JSON responses
