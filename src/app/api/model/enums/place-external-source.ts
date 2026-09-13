export enum PlaceExternalSource {
  OSM = 'osm',
  MANUAL = 'manual',
}

export function getPlaceExternalSourceFromString(value: string): PlaceExternalSource | null {
  if (!Object.values(PlaceExternalSource).includes(value as PlaceExternalSource)) {
    return null;
  }
  return Object.values(PlaceExternalSource).find(
    (enumValue) => enumValue === value
  ) as PlaceExternalSource;
}
