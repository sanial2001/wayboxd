export interface TripModel {
  id: number;
  userId: number;
  title: string;
  blurb: string | null;
  coverImageUrl: string;
  outboundUrl: string;
  tag: string | null;
  duration: string | null;
  tripDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
}
