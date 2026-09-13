import { PlaceCategory } from '@/app/api/model/enums/place-category';
import { PlaceExternalSource } from '@/app/api/model/enums/place-external-source';

export interface SavePlaceRequest {
  name: string;
  category: PlaceCategory;
  city: string;
  country: string;
  slug?: string;
  description?: string | null;
  parentPlaceId?: number | null;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  coverImageUrl?: string | null;
  externalSource?: PlaceExternalSource | null;
  externalId?: string | null;
  createdByUserId?: number | null;
}
