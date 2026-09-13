import { PlaceCategory } from '@/app/api/model/enums/place-category';
import { PlaceExternalSource } from '@/app/api/model/enums/place-external-source';

export interface PlaceModel {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category: PlaceCategory;
  parentPlaceId: number | null;
  externalSource: PlaceExternalSource | null;
  externalId: string | null;
  city: string;
  region: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  coverImageUrl: string | null;
  createdByUserId: number | null;
  createdAt: Date;
  updatedAt: Date | null;
}
