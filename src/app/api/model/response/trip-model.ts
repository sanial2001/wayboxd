import { TripStatus } from '@/app/api/model/enums/trip-status';

export interface TripModel {
  id: number;
  userId: number;
  title: string;
  blurb: string | null;
  coverImageUrl: string;
  outboundUrl: string | null;
  tag: string | null;
  duration: string | null;
  tripDate: Date;
  status: TripStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}
