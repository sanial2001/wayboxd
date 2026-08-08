---
name: new-api-route
description: Create a new Next.js API route handler for Wayboxd. Use when adding a new API endpoint, creating a new route.ts file, or implementing GET/POST/PUT/DELETE handlers.
---

# New API Route

Use this skill when creating or modifying `route.ts` files in `src/app/api/`.

## Structure

All routes live under `src/app/api/(controller)/`. Create a folder per resource and place `route.ts` inside.

```
src/app/api/
  └── (controller)/
      ├── public/              # Unauthenticated routes
      │   └── user-signup/
      │       └── route.ts
      ├── auth/                # NextAuth
      └── <resource>/          # Protected routes (require session)
          └── route.ts
```

Public routes must live under `public/` so `src/proxy.ts` allows unauthenticated access.

## Required imports

```typescript
import { NextRequest } from 'next/server';
import { createApiResponse } from '@/app/service/_utils/api-response';
```

For protected routes, rely on `src/proxy.ts` for session enforcement before the handler runs.

## Rules

1. **Always wrap handlers in try-catch** — route handlers catch all errors, service layer does NOT
2. **Use `createApiResponse`** for all responses — never return raw `NextResponse.json`
3. **Validate at route level** — business logic stays in the service layer, but input validation belongs here
4. **Use appropriate status codes**: 200 (ok), 201 (created), 400 (bad request), 403 (unauthorized), 404 (not found), 500 (server error)
5. **Request types** in `src/app/api/model/request/`; **response types** in `src/app/api/model/response/`

## Error code conventions

| Method | Error Code     |
| ------ | -------------- |
| GET    | `GET_ERROR`    |
| POST   | `POST_ERROR`   |
| PUT    | `PUT_ERROR`    |
| DELETE | `DELETE_ERROR` |

## Templates

### POST (public create — e.g. signup)

```typescript
import { NextRequest } from 'next/server';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { saveUser, getUserByEmail } from '@/app/service/user/user-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.email?.trim()) {
      return createApiResponse({
        error: 'Email is required',
        status: 400,
      });
    }

    const existingUser = await getUserByEmail(body.email.trim());
    if (existingUser) {
      return createApiResponse({
        error: 'User Email already exists',
        status: 400,
      });
    }

    const user = await saveUser(body);
    return createApiResponse({ data: user, status: 201 });
  } catch (error) {
    return createApiResponse({
      error: 'Failed to sign up',
      errorCode: 'POST_ERROR',
      status: 500,
    });
  }
}
```

### GET (protected)

```typescript
import { NextRequest } from 'next/server';
import { createApiResponse } from '@/app/service/_utils/api-response';
import { getUserById } from '@/app/service/user/user-service';

export async function GET(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.searchParams.get('id'));
    const user = await getUserById(id);

    if (!user) {
      return createApiResponse({
        error: 'User not found',
        status: 404,
      });
    }

    return createApiResponse({ data: user, status: 200 });
  } catch (error) {
    return createApiResponse({
      error: 'Failed to retrieve user',
      errorCode: 'GET_ERROR',
      status: 500,
    });
  }
}
```

## Proxy / auth

`src/proxy.ts` uses `withAuth` and excludes public and auth paths:

```typescript
matcher: ['/api/:path((?!public|auth).*)'];
```

Add new public path segments to the negative lookahead when introducing new unauthenticated API prefixes.
