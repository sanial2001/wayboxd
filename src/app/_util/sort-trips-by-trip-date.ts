import { TripModel } from '@/app/api/model/response/trip-model';

export function sortTripsByTripDateDesc(trips: TripModel[]): TripModel[] {
  return [...trips].sort((left, right) => {
    const leftTime = new Date(left.tripDate).getTime();
    const rightTime = new Date(right.tripDate).getTime();
    if (rightTime !== leftTime) {
      return rightTime - leftTime;
    }
    return right.id - left.id;
  });
}
