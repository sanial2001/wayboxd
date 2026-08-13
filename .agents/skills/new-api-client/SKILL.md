---
name: new-api-client
description: Create a new API client function for Wayboxd. Use when adding browser-side fetch wrappers for API routes, or creating files under src/app/api/client/.
---

# New API Client

Use this skill when adding client functions under `src/app/api/client/`.

## Structure

```
src/app/api/client/
  └── <domain>-service-client.ts
```

Group by domain entity (same naming as service layer): `user-service-client.ts`, not per-route files.

## Rules

1. **Function suffix**: `*Client` (e.g. `userSignupClient`)
2. **Types**: import from `@/app/api/model/request/` and `@/app/api/model/response/`
3. **Return type**: `Promise<ApiResponse<T>>` when the route uses `createApiResponse`
4. **Paths**: mirror route URL — `(controller)/public/user-signup/route.ts` → `/api/public/user-signup`
5. **Headers**: always set `Content-Type: application/json` for JSON bodies

## Template (POST — public)

```typescript
import { UserSignupRequest } from '@/app/api/model/request/user-signup-request';
import { ApiResponse } from '@/app/api/model/response/api-response';
import { UserModel } from '@/app/api/model/response/user-model';

export async function userSignupClient(
  userSignupRequest: UserSignupRequest
): Promise<ApiResponse<UserModel>> {
  try {
    const response = await fetch('/api/public/user-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSignupRequest),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
}
```

## Template (GET — protected)

```typescript
import { ApiResponse } from '@/app/api/model/response/api-response';
import { UserModel } from '@/app/api/model/response/user-model';

export async function getUserByIdClient(id: number): Promise<ApiResponse<UserModel>> {
  try {
    const response = await fetch(`/api/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
}
```

## Usage in UI

```typescript
'use client';

import { userSignupClient } from '@/app/api/client/user-service-client';

const result = await userSignupClient({ email, name, password });
if (result.error) {
  // show result.error
  return;
}
// use result.data
```

## After adding a client

- Add the matching route under `src/app/api/(controller)/` if it does not exist
- Export new functions from the domain's `*-service-client.ts` file (do not create one file per endpoint)
