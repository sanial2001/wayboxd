export interface SaveTripRequest {
  userId: number;
  title: string;
  coverImageUrl: string;
  outboundUrl: string;
  tripDate: Date;
  blurb?: string | null;
  tag?: string | null;
  duration?: string | null;
}
