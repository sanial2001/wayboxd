/**
 * Trip lifecycle. Stored as string on `trips.status` (Prisma default `Draft`).
 *
 * Draft     — incomplete; owner can resume (e.g. cancelled mid-upload). Not public.
 * Published — live on the owner's public profile. `publishedAt` set on first publish.
 * Archived  — finished trip taken off the public grid; owner-only, restorable.
 * Deleted   — soft-deleted (trash). Hidden from public and owner library until restored or purged.
 */
export enum TripStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
}

/** Visible on a public profile to other people. */
export const PUBLIC_TRIP_STATUSES = [TripStatus.PUBLISHED] as const;

/** Owner's working set: drafts, live trips, and archive — not trash. */
export const OWNER_LIBRARY_TRIP_STATUSES = [
  TripStatus.DRAFT,
  TripStatus.PUBLISHED,
  TripStatus.ARCHIVED,
] as const;

export function getTripStatusFromString(value: string): TripStatus | null {
  if (!Object.values(TripStatus).includes(value as TripStatus)) {
    return null;
  }
  return Object.values(TripStatus).find((enumValue) => enumValue === value) as TripStatus;
}

export function isPublicTripStatus(status: TripStatus): boolean {
  return (PUBLIC_TRIP_STATUSES as readonly TripStatus[]).includes(status);
}

export function isOwnerLibraryTripStatus(status: TripStatus): boolean {
  return (OWNER_LIBRARY_TRIP_STATUSES as readonly TripStatus[]).includes(status);
}

export function isDeletedTripStatus(status: TripStatus): boolean {
  return status === TripStatus.DELETED;
}
