import { PlaceCategory } from '@/app/api/model/enums/place-category';

/** Body when the user selects an OSM row from place search (Photon hit). */
export interface SavePlaceFromOsmRequest {
  externalId: string;
  osmType: string;
  osmKey: string;
  osmValue: string;
  name: string;
  category: PlaceCategory;
  city: string;
  country: string;
  region?: string | null;
  latitude: number;
  longitude: number;
  address?: string | null;
}
