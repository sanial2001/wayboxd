import { OsmPlaceSearchHit } from '@/app/api/model/response/osm-place-search-hit';

/** Place chosen in the trip composer, before or after it has a local id. */
export interface TripPlaceSelection {
  label: string;
  placeId: number | null;
  osmHit: OsmPlaceSearchHit | null;
}

export interface TripPlaceOption {
  key: string;
  name: string;
  detail: string;
  selection: TripPlaceSelection;
}
