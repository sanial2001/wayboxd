---
name: new-prisma-migration
description: Create or modify Prisma schema changes and migrations for Wayboxd. Use when adding models, fields, relations, or running database migrations.
---

# Prisma Migration

Use when changing `prisma/schema.prisma` or creating migrations.

## Prerequisites

- PostgreSQL running locally
- `DATABASE_URL` in `.env.local` or `.env` (loaded via `prisma.config.ts`)

## Workflow

1. Edit `prisma/schema.prisma`
2. Create migration:
   ```bash
   npm run prisma:migrate -- descriptive_migration_name
   ```
3. Verify generated SQL in `prisma/migrations/<timestamp>_descriptive_migration_name/`
4. Client regenerates automatically on `npm run dev` / `npm run build`

## Rules

1. **Never edit applied migrations** — only change `schema.prisma` and create a new migration
2. **Use `@@map`** for table names when needed (e.g. `@@map("users")`)
3. **Update service and response models** when schema changes affect API shapes

## Naming conventions

| Item      | Convention              | Example              |
| --------- | ----------------------- | -------------------- |
| Model     | PascalCase singular     | `User`               |
| Field     | camelCase               | `createdAt`          |
| Migration | snake_case via `--name` | `add_user_name_index` |

## Deploy (non-dev)

```bash
npm run prisma:deploy
```

## Common patterns

### Add optional field

```prisma
model User {
  // existing fields...
  bio String?
}
```

### Add relation

```prisma
model Review {
  user   User @relation(fields: [userId], references: [id])
  userId Int
}
```

### Add index

```prisma
@@index([email])
```

## After migration

- Update `src/app/service/<entity>/<entity>-service.ts`
- Update `src/app/api/model/response/` models if API shape changes
- Update `docs/agent/domain-map.md` for new entities or relationships
