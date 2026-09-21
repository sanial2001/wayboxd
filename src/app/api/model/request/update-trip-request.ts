import { TripStatus } from '@/app/api/model/enums/trip-status';

/** API / client body — tripId is a path param, userId comes from the session. Cover is not updatable. */
export interface UpdateTripBodyRequest {
  title?: string;
  blurb?: string | null;
  outboundUrl?: string;
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
}
