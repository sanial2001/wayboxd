import { TripStatus } from '@/app/api/model/enums/trip-status';

/** API / client body — userId comes from the session, not the payload. */
export interface SaveTripBodyRequest {
  title: string;
  coverImageUrl: string;
  tripDate: string;
  outboundUrl?: string | null;
  blurb?: string | null;
  tag?: string | null;
  duration?: string | null;
}

/** API / client body for an unfinished trip. Cover, outbound URL, and date may be omitted. */
export interface SaveDraftTripBodyRequest {
  title: string;
  coverImageUrl?: string | null;
  outboundUrl?: string | null;
  tripDate?: string | null;
  blurb?: string | null;
  tag?: string | null;
  duration?: string | null;
}

/** Service-layer create input for `saveTrip` (create only). */
export interface SaveTripRequest {
  userId: number;
  title: string;
  coverImageUrl: string;
  outboundUrl?: string | null;
  tripDate: Date;
  blurb?: string | null;
  tag?: string | null;
  duration?: string | null;
  status: TripStatus;
  publishedAt: Date | null;
}
