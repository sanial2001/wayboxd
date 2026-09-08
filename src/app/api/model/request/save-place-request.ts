import { PlaceCategory } from '@/app/api/model/enums/place-category';

export interface SavePlaceRequest {
  slug: string;
  name: string;
  category: PlaceCategory;
  city: string;
  country: string;
  description?: string | null;
  parentPlaceId?: number | null;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  coverImageUrl?: string | null;
  createdByUserId?: number | null;
}
