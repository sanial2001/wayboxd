/** API / client body — userId comes from the session, not the payload. Cover is not updatable. */
export interface UpdateTripBodyRequest {
  id: number;
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
}
