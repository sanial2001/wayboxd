/** GeoJSON feature collection returned by Photon `/api` search. */
export interface PhotonFeatureCollection {
  type?: string;
  features?: PhotonFeature[];
}

export interface PhotonFeature {
  type?: string;
  properties?: PhotonFeatureProperties;
  geometry?: PhotonPointGeometry;
}

export interface PhotonPointGeometry {
  type?: string;
  coordinates?: [number, number];
}

export interface PhotonFeatureProperties {
  osm_type?: string;
  osm_id?: number;
  osm_key?: string;
  osm_value?: string;
  name?: string;
  street?: string;
  housenumber?: string;
  locality?: string;
  district?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
  countrycode?: string;
  postcode?: string;
}
