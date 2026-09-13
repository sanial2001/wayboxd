export enum PlaceCategory {
  DESTINATION = 'Destination',
  AREA = 'Area',
  CAFE = 'Cafe',
  RESTAURANT = 'Restaurant',
  BAR = 'Bar',
  PARK = 'Park',
  MUSEUM = 'Museum',
  OTHER = 'Other',
}

export function getPlaceCategoryFromString(value: string): PlaceCategory | null {
  if (!Object.values(PlaceCategory).includes(value as PlaceCategory)) {
    return null;
  }
  return Object.values(PlaceCategory).find((enumValue) => enumValue === value) as PlaceCategory;
}

/** Maps OpenStreetMap tag key/value (Photon `osm_key` / `osm_value`) to Wayboxd category. */
export function getPlaceCategoryFromOsmTags(osmKey: string, osmValue: string): PlaceCategory {
  const key = osmKey.trim().toLowerCase();
  const value = osmValue.trim().toLowerCase();

  if (key === 'amenity') {
    if (value === 'cafe' || value === 'coffee_shop') {
      return PlaceCategory.CAFE;
    }
    if (value === 'restaurant' || value === 'fast_food' || value === 'food_court') {
      return PlaceCategory.RESTAURANT;
    }
    if (value === 'bar' || value === 'pub' || value === 'biergarten' || value === 'nightclub') {
      return PlaceCategory.BAR;
    }
  }

  if (key === 'leisure' && value === 'park') {
    return PlaceCategory.PARK;
  }

  if (key === 'tourism' && value === 'museum') {
    return PlaceCategory.MUSEUM;
  }

  if (key === 'place') {
    if (value === 'city' || value === 'town' || value === 'village' || value === 'hamlet') {
      return PlaceCategory.DESTINATION;
    }
    if (
      value === 'suburb' ||
      value === 'neighbourhood' ||
      value === 'neighborhood' ||
      value === 'quarter'
    ) {
      return PlaceCategory.AREA;
    }
  }

  return PlaceCategory.OTHER;
}
