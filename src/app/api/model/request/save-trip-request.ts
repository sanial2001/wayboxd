import { TripStatus } from '@/app/api/model/enums/trip-status';

/** API / client body — userId comes from the session, not the payload. */
export interface SaveTripBodyRequest {
  title: string;
  coverImageUrl: string;
  outboundUrl: string;
  tripDate: string;
  blurb?: string | null;
  tag?: string | null;
  duration?: string | null;
}

/** Service-layer create input for `saveTrip` (create only). */
export interface SaveTripRequest {
  userId: number;
  title: string;
  coverImageUrl: string;
  outboundUrl: string;
  tripDate: Date;
  blurb?: string | null;
  tag?: string | null;
  duration?: string | null;
  status: TripStatus;
  publishedAt: Date | null;
}
