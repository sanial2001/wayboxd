# Wayboxd Domain Map

Reference for agents working in this codebase. For schema details, read `prisma/schema.prisma`.

## Overview

Wayboxd is a Next.js 16 app (App Router, React 19) with PostgreSQL via Prisma and NextAuth credentials auth.

## Core domains

### Users & auth

```
User (users)
  ├── email (unique)
  ├── username
  ├── password (bcrypt hash — never exposed in API models)
  └── timestamps (createdAt, updatedAt)

UserProfile (user_profiles) — 1:1 with User
  ├── displayName, bio, avatarUrl
  ├── instagramProfileUrl, xProfileUrl
  └── timestamps (createdAt, updatedAt)

Follow (follows) — directed user → user edge
  ├── followerId → User
  ├── followeeId → User
  └── createdAt
```

**Services:** `src/app/service/user/user-service.ts`, `user-profile-service.ts`, `follow-service.ts`

**Client:** `src/app/api/client/user-service-client.ts` (`userSignupClient`, `userSigninClient`, `saveUserProfileClient`, `uploadUserAvatarClient`)

**Profile UI:** `/profile/[username]` — RSC via `loadPublicProfilePageData` + `getPublicUserProfileByUsername` + `getTripsByUserId`. Own profile shows **Edit profile** → `/settings/profile` and **+ Add trip**. Own trip view modal shows **Edit** → `updateTripClient` (title, blurb, outbound URL only).

**Profile edit UI:** `/settings/profile` — RSC loads session + `getUserProfileByUserId`; `ProfileEditForm` uses `uploadUserAvatarClient` + `saveUserProfileClient` only

**Auth:** `src/app/api/(controller)/auth/[...nextauth]/options.ts`

**Public signup:** `POST /api/public/user-signup`

**Public sign-in:** `POST /api/public/user-signin`

**Save profile (session required):** `POST /api/user/profile/save` — `userId` from session; creates or updates `UserProfile`

**Upload avatar (session required for token):** `POST /api/user/profile/avatar` — Vercel Blob `handleUpload`; then save `avatarUrl` via profile save

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

**Enum:** `src/app/api/model/enums/place-external-source.ts` (`osm`, `manual`)

**Service:** `src/app/service/place/place-service.ts` (`searchPlaces`, `findOrCreatePlaceFromOsm`, `saveManualPlace`, `getPlaceByExternalId`)

**Manual add:** `SaveManualPlaceRequest` → `saveManualPlace` → `savePlace` with `manual` source, or `{ status: 'duplicate', candidates }`

**Search result type:** `src/app/api/model/response/place-search-result.ts`

**Client:** `src/app/api/client/place-service-client.ts` (`searchPlacesClient`)

**Place search (session required):** `GET /api/place/search?q=`

**Save place from OSM (session required):** `POST /api/place/save/from-osm` → `findOrCreatePlaceFromOsmRequest`

**Save manual place (session required):** `POST /api/place/save/manual` → `saveManualPlace` (409 + candidates on duplicate)

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

### Trips

```
Trip (trips)
  ├── userId → User
  ├── title, blurb
  ├── coverImageUrl, outboundUrl
  ├── tag, duration
  ├── tripDate
  ├── status (Draft | Published | Archived | Deleted)
  ├── publishedAt (set on first publish; kept through archive/delete)
  └── timestamps (createdAt, updatedAt)
```

**Enum:** `src/app/api/model/enums/trip-status.ts` (`Draft`, `Published`, `Archived`, `Deleted`). Public profiles show `Published` only; owner library is Draft/Published/Archived; `Deleted` is soft-delete/trash.

**Service:** `src/app/service/trip/trip-service.ts`

**Client:** `src/app/api/client/trip-service-client.ts` (`saveTripClient`, `updateTripClient`, `uploadTripCoverClient`)

**Save trip (session required):** `POST /api/user/trip/save` — `userId` from session; create only

**Update trip (session required):** `PUT /api/user/trip/update/{tripId}` — owner only; title, blurb, and/or outboundUrl; cover cannot change. Own-profile view modal uses `EditTripModal` + `updateTripClient`.

**Upload cover (session required for token):** `POST /api/user/trip/cover` — Vercel Blob `handleUpload`; then save `coverImageUrl` via trip save

## API layout

| Path                             | Auth                          | Purpose                                       |
| -------------------------------- | ----------------------------- | --------------------------------------------- |
| `/api/public/*`                  | None                          | Public endpoints (signup, sign-in, etc.)      |
| `/api/auth/*`                    | NextAuth                      | Session login/logout                          |
| `/api/docs/swagger.json`         | Session required              | OpenAPI spec (404 when `APP_ENV=production`)  |
| `/api-docs`                      | Page is public                | Swagger UI (spec fetch still needs a session) |
| `/api/user/profile/save`         | Session required              | Create or update the signed-in user's profile |
| `/api/user/profile/avatar`       | Session required (token step) | Vercel Blob client upload for avatars         |
| `/api/user/trip/save`            | Session required              | Create a trip for the signed-in user          |
| `/api/user/trip/update/{tripId}` | Session required              | Update title, blurb, and/or outbound URL      |
| `/api/user/trip/cover`           | Session required (token step) | Vercel Blob client upload for trip covers     |
| `/api/*` (other)                 | Session required              | Protected APIs (`src/proxy.ts`)               |

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
