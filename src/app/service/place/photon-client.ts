// Photon (OpenStreetMap) search over HTTP. Env: PHOTON_BASE_URL, PHOTON_USER_AGENT. Server-only — do not call from the browser.
import { getPlaceCategoryFromOsmTags } from '@/app/api/model/enums/place-category';
import {
  PhotonFeature,
  PhotonFeatureCollection,
  PhotonFeatureProperties,
} from '@/app/api/model/external/photon/photon-api-types';
import {
  OSM_PLACE_SEARCH_SOURCE,
  OsmPlaceSearchHit,
} from '@/app/api/model/response/osm-place-search-hit';

const MIN_QUERY_LENGTH = 2;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 10;

/** Typeahead search; returns normalized hits for UI / findOrCreatePlaceFromOsm (does not write to DB). */
export async function searchOsmPlacesByQuery(
  query: string,
  limit: number = DEFAULT_LIMIT
): Promise<OsmPlaceSearchHit[]> {
  const trimmedQuery = query.trim();
  // Avoid noisy one-letter calls; caller may treat empty as "keep typing".
  if (trimmedQuery.length < MIN_QUERY_LENGTH) {
    return [];
  }
  const effectiveLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
  const url = buildPhotonSearchUrl(trimmedQuery, effectiveLimit);
  // User-Agent is required courtesy for public Photon instances.
  const response = await fetch(url, {
    headers: {
      'User-Agent': getPhotonUserAgent(),
    },
  });
  if (!response.ok) {
    throw new Error(`Photon search failed with status ${response.status}`);
  }
  const payload = (await response.json()) as PhotonFeatureCollection;
  if (!payload.features?.length) {
    return [];
  }
  // GeoJSON features → Wayboxd shape; drop unnamed / incomplete rows.
  return payload.features
    .map(mapPhotonFeatureToHit)
    .filter((hit): hit is OsmPlaceSearchHit => hit !== null);
}

// From .env.local — default install uses https://photon.komoot.io
function getPhotonBaseUrl(): string {
  const baseUrl = process.env.PHOTON_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error('PHOTON_BASE_URL is not set');
  }
  return baseUrl.replace(/\/$/, '');
}

// Identifies Wayboxd to the Photon operator (e.g. Wayboxd/1.0).
function getPhotonUserAgent(): string {
  const userAgent = process.env.PHOTON_USER_AGENT?.trim();
  if (!userAgent) {
    throw new Error('PHOTON_USER_AGENT is not set');
  }
  return userAgent;
}

function buildPhotonSearchUrl(query: string, limit: number): string {
  const normalizedBase = getPhotonBaseUrl();
  // Komoot Photon search endpoint: GET /api?q=...&limit=...
  const url = new URL(`${normalizedBase}/api`);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(limit));
  return url.toString();
}

function mapPhotonFeatureToHit(feature: PhotonFeature): OsmPlaceSearchHit | null {
  const props = feature.properties;
  const coordinates = feature.geometry?.coordinates;
  // Need a display name + OSM identity + a point to import as a Place.
  if (!props?.name?.trim() || !props.osm_type || props.osm_id === undefined || !coordinates) {
    return null;
  }

  // Photon returns [lng, lat] (GeoJSON order).
  const [longitude, latitude] = coordinates;
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return null;
  }

  const osmKey = props.osm_key?.trim() ?? '';
  const osmValue = props.osm_value?.trim() ?? '';

  return {
    source: OSM_PLACE_SEARCH_SOURCE,
    // Stable OSM id, e.g. N1737985671 — matches findOrCreatePlaceFromOsm / DB externalId.
    externalId: `${props.osm_type}${props.osm_id}`,
    osmType: props.osm_type,
    osmKey,
    osmValue,
    name: props.name.trim(),
    // amenity=cafe, place=city, etc. → Wayboxd PlaceCategory.
    category: getPlaceCategoryFromOsmTags(osmKey, osmValue),
    city: resolveCity(props),
    region: props.state?.trim() ?? null,
    country: resolveCountry(props),
    latitude,
    longitude,
    address: buildAddress(props),
  };
}

// Photon POIs often lack `city`; fall through district → locality → county.
function resolveCity(props: PhotonFeatureProperties): string {
  const candidates = [props.city, props.district, props.locality, props.county];
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value) {
      return value;
    }
  }
  return 'Unknown';
}

function resolveCountry(props: PhotonFeatureProperties): string {
  const country = props.country?.trim();
  if (country) {
    return country;
  }
  // Fallback to ISO code when full country name is missing.
  const code = props.countrycode?.trim();
  if (code) {
    return code.toUpperCase();
  }
  return 'Unknown';
}

function buildAddress(props: PhotonFeatureProperties): string | null {
  // Single line for Place.address; omit when Photon has no street-level data.
  const parts = [props.housenumber, props.street, props.locality, props.postcode].filter(
    (part): part is string => typeof part === 'string' && part.trim().length > 0
  );
  if (parts.length === 0) {
    return null;
  }
  return parts.map((part) => part.trim()).join(', ');
}
