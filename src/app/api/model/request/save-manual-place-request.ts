import { PlaceCategory } from '@/app/api/model/enums/place-category';

export interface SaveManualPlaceRequest {
  name: string;
  category: PlaceCategory;
  city: string;
  country: string;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  createdByUserId?: number | null;
}
