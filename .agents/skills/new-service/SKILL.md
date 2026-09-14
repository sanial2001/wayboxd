---
name: new-service
description: Create a new service layer module for Wayboxd. Use when adding business logic, creating service functions for a new domain entity, or implementing domain-specific operations.
---

# New Service Module

Use this skill when adding service layer code under `src/app/service/`.

## Directory structure

Each domain entity gets its own folder:

```
src/app/service/
  ├── _lib/
  │   └── prisma.ts
  ├── _utils/
  │   └── api-response.ts
  ├── email/                    # transactional email (see new-email-template skill)
  │   ├── email-service.ts
  │   └── templates/
  └── <entity-name>/
      └── <entity-name>-service.ts
```

For outbound email templates, use the `new-email-template` skill — do not scatter HTML at repo root.

## Key rules

### 1. No try-catch in service layer

Service functions MUST let exceptions bubble up to route handlers.

```typescript
// Good — let exceptions bubble up
export async function saveUser(data: SaveUserInput): Promise<UserModel> {
  const user = await prisma.user.create({ data: { ... } });
  return mapUserEntityToModel(user);
}

// Bad — service layer swallowing errors
export async function saveUser(data: SaveUserInput) {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    return null;
  }
}
```

### 2. Use Prisma via the shared client

```typescript
import prisma from '@/app/service/_lib/prisma';
```

### 3. TypeScript typing and model layer

- Always declare return types explicitly
- Avoid `any` — prefer typed inputs or `Partial<UserModel>` where appropriate
- **Declare all interfaces and types in the model layer** — never in service files (see `model-layer-types` skill)
- **Response types** → `src/app/api/model/response/`
- **Request types** → `src/app/api/model/request/`
- **External API wire types** → `src/app/api/model/external/<provider>/`

### 4. Do not change legacy CRUD functions

**Never change the behavior or signature of existing `saveX`, `updateX`, `deleteX`, or `getX` helpers** to fit a new API or feature. Treat them as stable contracts:

- `saveX` → **create only** (Prisma `create`)
- `updateX` → **update existing row only** (returns `null` or throws when missing, per existing pattern)
- `deleteX` → **delete only**

When you need create-or-update, session-scoped writes, or any flow that does not match a single CRUD call, **orchestrate existing service functions** (usually in the route handler): e.g. `getUserProfileByUserId` → `saveUserProfile` or `updateUserProfile`. Do not fold upsert into `saveX`, and do not add a separate upsert-only service helper when composing `save` + `update` is enough.

```typescript
// Good — route composes legacy CRUD; saveUserProfile stays create-only
const existing = await getUserProfileByUserId(userId);
if (existing) {
  const profile = await updateUserProfile(userId, body);
  // ...
} else {
  const profile = await saveUserProfile({ userId, ...body });
  // ...
}

// Bad — changing saveUserProfile to upsert breaks callers and review expectations
export async function saveUserProfile(userId: number, data: SaveUserProfileBodyRequest) {
  return prisma.userProfile.upsert({ ... });
}
```

Also recorded in `docs/agent/memory.md`.

### 5. Function naming conventions

| Operation                       | Name pattern                                                                                                                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Create                          | `saveX(data)`                                                                                                                           |
| Read one                        | `getXById(id)` / `getXByEmail(email)`                                                                                                   |
| Read many                       | `getXsByY(y)`                                                                                                                           |
| Update                          | `updateX(id, data)`                                                                                                                     |
| Delete                          | `deleteX(id)`                                                                                                                           |
| Map                             | `mapXEntityToModel(entity)`                                                                                                             |
| Composite flows (orchestration) | Prefer route-level `get` + `save` / `update`; new service name only when logic is non-trivial (e.g. `findOrCreateX` with external APIs) |

### 6. Map entities to response models

Services return typed **model** objects (not raw Prisma entities). Never expose `password` in mapped models.

```typescript
import { User } from '@prisma/client';
import { UserModel } from '@/app/api/model/response/user-model';

function mapUserEntityToModel(user: User): UserModel {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
```

### 7. Password handling

- Hash passwords in the service layer before persisting
- Use `@/app/_util/password` for compare/hash when using async bcrypt helpers
- `getUserWithPasswordByEmail` is for auth only — do not use in public API responses

## Example service file

Reference: `src/app/service/user/user-service.ts`

```typescript
import { UserModel } from '@/app/api/model/response/user-model';
import prisma from '@/app/service/_lib/prisma';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';

export async function getUserById(id: number): Promise<UserModel | null> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return null;
  }
  return mapUserEntityToModel(user);
}

export async function saveUser(data: SaveUserInput): Promise<UserModel> {
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name ?? null,
      password: hashSync(data.password, 10),
      createdAt: new Date(),
    },
  });
  return mapUserEntityToModel(user);
}

function mapUserEntityToModel(user: User): UserModel {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
```

## After adding a service

- Wire the route handler under `src/app/api/(controller)/`
- Add request/response models if new shapes are needed
- Update `docs/agent/domain-map.md` when introducing a new entity
