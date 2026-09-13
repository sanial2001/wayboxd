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

export async function searchOsmPlacesByQuery(
  query: string,
  limit: number = DEFAULT_LIMIT
): Promise<OsmPlaceSearchHit[]> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const effectiveLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
  const url = buildPhotonSearchUrl(trimmedQuery, effectiveLimit);

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

  return payload.features
    .map(mapPhotonFeatureToHit)
    .filter((hit): hit is OsmPlaceSearchHit => hit !== null);
}

function getPhotonBaseUrl(): string {
  const baseUrl = process.env.PHOTON_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error('PHOTON_BASE_URL is not set');
  }
  return baseUrl.replace(/\/$/, '');
}

function getPhotonUserAgent(): string {
  const userAgent = process.env.PHOTON_USER_AGENT?.trim();
  if (!userAgent) {
    throw new Error('PHOTON_USER_AGENT is not set');
  }
  return userAgent;
}

function buildPhotonSearchUrl(query: string, limit: number): string {
  const normalizedBase = getPhotonBaseUrl();
  const url = new URL(`${normalizedBase}/api`);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(limit));
  return url.toString();
}

function mapPhotonFeatureToHit(feature: PhotonFeature): OsmPlaceSearchHit | null {
  const props = feature.properties;
  const coordinates = feature.geometry?.coordinates;
  if (!props?.name?.trim() || !props.osm_type || props.osm_id === undefined || !coordinates) {
    return null;
  }

  const [longitude, latitude] = coordinates;
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return null;
  }

  const osmKey = props.osm_key?.trim() ?? '';
  const osmValue = props.osm_value?.trim() ?? '';

  return {
    source: OSM_PLACE_SEARCH_SOURCE,
    externalId: `${props.osm_type}${props.osm_id}`,
    osmType: props.osm_type,
    osmKey,
    osmValue,
    name: props.name.trim(),
    category: getPlaceCategoryFromOsmTags(osmKey, osmValue),
    city: resolveCity(props),
    region: props.state?.trim() ?? null,
    country: resolveCountry(props),
    latitude,
    longitude,
    address: buildAddress(props),
  };
}

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
  const code = props.countrycode?.trim();
  if (code) {
    return code.toUpperCase();
  }
  return 'Unknown';
}

function buildAddress(props: PhotonFeatureProperties): string | null {
  const parts = [props.housenumber, props.street, props.locality, props.postcode].filter(
    (part): part is string => typeof part === 'string' && part.trim().length > 0
  );
  if (parts.length === 0) {
    return null;
  }
  return parts.map((part) => part.trim()).join(', ');
}
