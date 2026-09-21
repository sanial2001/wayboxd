import { TripStatus } from '@/app/api/model/enums/trip-status';

/** API / client body — tripId is a path param, userId comes from the session. All fields optional (partial). */
export interface UpdateTripBodyRequest {
  title?: string;
  blurb?: string | null;
  coverImageUrl?: string;
  outboundUrl?: string | null;
  tag?: string | null;
  duration?: string | null;
  tripDate?: string;
  status?: TripStatus;
}

/** Service-layer update input for `updateTrip` (existing row only). */
export interface UpdateTripRequest {
  title?: string;
  blurb?: string | null;
  coverImageUrl?: string;
  outboundUrl?: string;
  tag?: string | null;
  duration?: string | null;
  tripDate?: Date;
  status?: TripStatus;
  publishedAt?: Date | null;
}
