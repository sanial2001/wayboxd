---
name: model-layer-types
description: >-
  Wayboxd model layer typing rules. Use when adding TypeScript interfaces, types,
  enums, or DTOs for API, external services (Photon, etc.), or domain shapes.
---

# Model layer types

## Rule

**Declare all interfaces and types in the model layer.** Do not define `interface`, `type`, or enum-like constants for data shapes inside `src/app/service/`, route handlers, or UI components.

Service and route files contain functions and mapping logic only; they import types from `src/app/api/model/`.

## Layout

```
src/app/api/model/
  ├── enums/           # Domain enums + enum helpers (e.g. getPlaceCategoryFromOsmTags)
  ├── request/         # API input DTOs
  ├── response/        # API output DTOs + normalized domain models (PlaceModel, OsmPlaceSearchHit)
  └── external/        # Third-party wire formats, one folder per provider
      └── photon/
          └── photon-api-types.ts
```

| Kind of type                                           | Location               |
| ------------------------------------------------------ | ---------------------- |
| Public API request body                                | `request/`             |
| Public API response / app models                       | `response/`            |
| Route auth helper results (e.g. auth validation union) | `response/`            |
| Stored enum values + parsers                           | `enums/`               |
| External API JSON (Photon, Stripe, …)                  | `external/<provider>/` |

## Examples

**Good** — types in model, logic in service:

```typescript
// src/app/api/model/external/photon/photon-api-types.ts
export interface PhotonFeatureCollection { ... }

// src/app/service/place/photon-client.ts
import { PhotonFeatureCollection } from '@/app/api/model/external/photon/photon-api-types';
```

**Bad** — wire types at bottom of service file:

```typescript
// src/app/service/place/photon-client.ts
interface PhotonFeature { ... }  // move to model layer
```

## When adding a new integration

1. Add wire types under `src/app/api/model/external/<provider>/`.
2. Add normalized app shapes under `response/` or `request/` if they cross the API boundary.
3. Keep mapping functions in `src/app/service/`; import types from model.
