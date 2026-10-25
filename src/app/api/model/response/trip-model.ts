import { TripStatus } from '@/app/api/model/enums/trip-status';
import { TripPlaceModel } from '@/app/api/model/response/trip-place-model';

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
  placeId: number | null;
  place: TripPlaceModel | null;
  status: TripStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}
