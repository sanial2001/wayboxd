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
