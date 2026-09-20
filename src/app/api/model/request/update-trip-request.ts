export interface UpdateTripRequest {
  title?: string;
  blurb?: string | null;
  coverImageUrl?: string;
  outboundUrl?: string;
  tag?: string | null;
  duration?: string | null;
  tripDate?: Date;
}
