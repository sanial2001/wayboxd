import { OsmPlaceSearchHit } from '@/app/api/model/response/osm-place-search-hit';
import { PlaceModel } from '@/app/api/model/response/place-model';

export interface PlaceSearchResult {
  local: PlaceModel[];
  osm: OsmPlaceSearchHit[];
}
