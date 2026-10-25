import { TripPlaceModel } from '@/app/api/model/response/trip-place-model';

export interface ReviewModel {
  id: number;
  userId: number;
  placeId: number;
  title: string;
  body: string | null;
  rating: number;
  wouldGoAgain: boolean | null;
  visitDate: Date | null;
  tags: string[];
  place: TripPlaceModel;
  createdAt: Date;
  updatedAt: Date | null;
}
