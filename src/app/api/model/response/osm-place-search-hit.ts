import { PlaceCategory } from '@/app/api/model/enums/place-category';
import { PlaceExternalSource } from '@/app/api/model/enums/place-external-source';

export const OSM_PLACE_SEARCH_SOURCE = PlaceExternalSource.OSM;

export type OsmPlaceSearchSource = typeof OSM_PLACE_SEARCH_SOURCE;

/** Normalized OSM place from Photon, ready for find-or-create or search UI. */
export interface OsmPlaceSearchHit {
  source: OsmPlaceSearchSource;
  externalId: string;
  osmType: string;
  osmKey: string;
  osmValue: string;
  name: string;
  category: PlaceCategory;
  city: string;
  region: string | null;
  country: string;
  latitude: number;
  longitude: number;
  address: string | null;
}
