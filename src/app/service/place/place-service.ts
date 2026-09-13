import { PlaceCategory, getPlaceCategoryFromString } from '@/app/api/model/enums/place-category';
import {
  PlaceExternalSource,
  getPlaceExternalSourceFromString,
} from '@/app/api/model/enums/place-external-source';
import { SaveManualPlaceRequest } from '@/app/api/model/request/save-manual-place-request';
import { SavePlaceFromOsmRequest } from '@/app/api/model/request/save-place-from-osm-request';
import { SavePlaceRequest } from '@/app/api/model/request/save-place-request';
import { UpdatePlaceRequest } from '@/app/api/model/request/update-place-request';
import { ManualPlaceSaveResult } from '@/app/api/model/response/manual-place-save-result';
import {
  OSM_PLACE_SEARCH_SOURCE,
  OsmPlaceSearchHit,
} from '@/app/api/model/response/osm-place-search-hit';
import { PlaceModel } from '@/app/api/model/response/place-model';
import { PlaceSearchResult } from '@/app/api/model/response/place-search-result';
import { searchOsmPlacesByQuery } from '@/app/service/place/photon-client';
import { generateUniquePlaceSlug } from '@/app/service/place/place-slug';
import prisma from '@/app/service/_lib/prisma';
import { Place, Prisma } from '@prisma/client';

const PLACE_SEARCH_MIN_QUERY_LENGTH = 2;
const PLACE_SEARCH_LOCAL_LIMIT = 5;

export async function getPlaceById(id: number): Promise<PlaceModel | null> {
  const place = await prisma.place.findUnique({
    where: { id },
  });
  if (!place) {
    return null;
  }
  return mapPlaceEntityToModel(place);
}

export async function getPlaceBySlug(slug: string): Promise<PlaceModel | null> {
  const place = await prisma.place.findUnique({
    where: { slug },
  });
  if (!place) {
    return null;
  }
  return mapPlaceEntityToModel(place);
}

export async function getPlaceByExternalId(
  externalSource: PlaceExternalSource,
  externalId: string
): Promise<PlaceModel | null> {
  const place = await prisma.place.findFirst({
    where: {
      externalSource,
      externalId,
    },
  });
  if (!place) {
    return null;
  }
  return mapPlaceEntityToModel(place);
}

export async function findOrCreatePlaceFromOsm(
  hit: OsmPlaceSearchHit,
  createdByUserId?: number | null
): Promise<PlaceModel | null> {
  const existing = await getPlaceByExternalId(PlaceExternalSource.OSM, hit.externalId);
  if (existing) {
    return existing;
  }
  try {
    const created = await savePlace({
      name: hit.name,
      category: hit.category,
      city: hit.city,
      region: hit.region,
      country: hit.country,
      latitude: hit.latitude,
      longitude: hit.longitude,
      address: hit.address,
      externalSource: PlaceExternalSource.OSM,
      externalId: hit.externalId,
      createdByUserId: createdByUserId ?? null,
    });
    if (created) {
      return created;
    }
  } catch (error) {
    if (!isPlaceExternalIdentityUniqueViolation(error)) {
      throw error;
    }
  }
  return getPlaceByExternalId(PlaceExternalSource.OSM, hit.externalId);
}

export async function findOrCreatePlaceFromOsmRequest(
  data: SavePlaceFromOsmRequest,
  createdByUserId: number
): Promise<PlaceModel | null> {
  const hit = toOsmPlaceSearchHitFromRequest(data);
  if (!hit) {
    return null;
  }
  return findOrCreatePlaceFromOsm(hit, createdByUserId);
}

export async function getPlacesByCity(city: string, country?: string): Promise<PlaceModel[]> {
  const places = await prisma.place.findMany({
    where: {
      city,
      ...(country ? { country } : {}),
    },
    orderBy: { name: 'asc' },
  });
  return mapPlaceEntitiesToModels(places);
}

export async function getPlacesByParentPlaceId(parentPlaceId: number): Promise<PlaceModel[]> {
  const places = await prisma.place.findMany({
    where: { parentPlaceId },
    orderBy: { name: 'asc' },
  });
  return mapPlaceEntitiesToModels(places);
}

export async function searchPlaces(query: string): Promise<PlaceSearchResult> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < PLACE_SEARCH_MIN_QUERY_LENGTH) {
    return { local: [], osm: [] };
  }

  const [local, osmHits] = await Promise.all([
    searchLocalPlaces(trimmedQuery),
    searchOsmPlacesByQuery(trimmedQuery).catch((): OsmPlaceSearchHit[] => []),
  ]);

  const osm = await excludeOsmHitsAlreadyInDatabase(osmHits);
  return { local, osm };
}

export async function saveManualPlace(
  data: SaveManualPlaceRequest
): Promise<ManualPlaceSaveResult | null> {
  if (!isValidManualPlaceInput(data)) {
    return null;
  }
  if (!isValidPlaceCategory(data.category)) {
    return null;
  }

  const candidates = await findManualPlaceDuplicateCandidates(data.name, data.city, data.country);
  if (candidates.length > 0) {
    return { status: 'duplicate', candidates };
  }

  const place = await savePlace({
    name: data.name.trim(),
    category: data.category,
    city: data.city.trim(),
    country: data.country.trim(),
    region: data.region ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    address: data.address ?? null,
    externalSource: PlaceExternalSource.MANUAL,
    externalId: null,
    createdByUserId: data.createdByUserId ?? null,
  });

  if (!place) {
    return null;
  }

  return { status: 'created', place };
}

export async function savePlace(data: SavePlaceRequest): Promise<PlaceModel | null> {
  if (!isValidPlaceCategory(data.category)) {
    return null;
  }
  if (!isValidExternalIdentity(data.externalSource, data.externalId)) {
    return null;
  }

  const slug = data.slug?.trim()
    ? data.slug.trim()
    : await generateUniquePlaceSlug(data.name, data.city);

  const place = await prisma.place.create({
    data: {
      slug,
      name: data.name,
      description: data.description ?? null,
      category: data.category,
      parentPlaceId: data.parentPlaceId ?? null,
      city: data.city,
      region: data.region ?? null,
      country: data.country,
      latitude: toDecimalOrNull(data.latitude),
      longitude: toDecimalOrNull(data.longitude),
      address: data.address ?? null,
      coverImageUrl: data.coverImageUrl ?? null,
      externalSource: data.externalSource ?? null,
      externalId: data.externalId?.trim() ?? null,
      createdByUserId: data.createdByUserId ?? null,
      createdAt: new Date(),
    },
  });
  return mapPlaceEntityToModel(place);
}

export async function updatePlace(
  id: number,
  data: UpdatePlaceRequest
): Promise<PlaceModel | null> {
  if (data.category !== undefined && !isValidPlaceCategory(data.category)) {
    return null;
  }

  const existing = await prisma.place.findUnique({
    where: { id },
  });
  if (!existing) {
    return null;
  }

  const place = await prisma.place.update({
    where: { id },
    data: {
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.parentPlaceId !== undefined ? { parentPlaceId: data.parentPlaceId } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(data.region !== undefined ? { region: data.region } : {}),
      ...(data.country !== undefined ? { country: data.country } : {}),
      ...(data.latitude !== undefined ? { latitude: toDecimalOrNull(data.latitude) } : {}),
      ...(data.longitude !== undefined ? { longitude: toDecimalOrNull(data.longitude) } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.coverImageUrl !== undefined ? { coverImageUrl: data.coverImageUrl } : {}),
      updatedAt: new Date(),
    },
  });
  return mapPlaceEntityToModel(place);
}

export async function deletePlace(id: number): Promise<PlaceModel | null> {
  const existing = await prisma.place.findUnique({
    where: { id },
  });
  if (!existing) {
    return null;
  }

  const place = await prisma.place.delete({
    where: { id },
  });
  return mapPlaceEntityToModel(place);
}

async function findManualPlaceDuplicateCandidates(
  name: string,
  city: string,
  country: string
): Promise<PlaceModel[]> {
  const trimmedName = name.trim();
  const trimmedCity = city.trim();
  const trimmedCountry = country.trim();
  const normalizedName = normalizePlaceNameForComparison(trimmedName);

  const places = await prisma.place.findMany({
    where: {
      city: { equals: trimmedCity, mode: 'insensitive' },
      country: { equals: trimmedCountry, mode: 'insensitive' },
      name: { contains: trimmedName, mode: 'insensitive' },
    },
    orderBy: { name: 'asc' },
    take: 10,
  });

  return mapPlaceEntitiesToModels(places).filter((place) => {
    const candidateNormalized = normalizePlaceNameForComparison(place.name);
    return (
      candidateNormalized === normalizedName ||
      candidateNormalized.includes(normalizedName) ||
      normalizedName.includes(candidateNormalized)
    );
  });
}

async function searchLocalPlaces(query: string): Promise<PlaceModel[]> {
  const places = await prisma.place.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { name: 'asc' },
    take: PLACE_SEARCH_LOCAL_LIMIT,
  });
  return mapPlaceEntitiesToModels(places);
}

async function excludeOsmHitsAlreadyInDatabase(
  hits: OsmPlaceSearchHit[]
): Promise<OsmPlaceSearchHit[]> {
  if (hits.length === 0) {
    return [];
  }

  const externalIds = hits.map((hit) => hit.externalId);
  const existingPlaces = await prisma.place.findMany({
    where: {
      externalSource: OSM_PLACE_SEARCH_SOURCE,
      externalId: { in: externalIds },
    },
    select: { externalId: true },
  });

  const existingExternalIds = new Set(
    existingPlaces
      .map((place) => place.externalId)
      .filter((externalId): externalId is string => externalId !== null)
  );

  return hits.filter((hit) => !existingExternalIds.has(hit.externalId));
}

function mapPlaceEntitiesToModels(places: Place[]): PlaceModel[] {
  return places.map(mapPlaceEntityToModel).filter((place): place is PlaceModel => place !== null);
}

function mapPlaceEntityToModel(place: Place): PlaceModel | null {
  const category = getPlaceCategoryFromString(place.category);
  if (!category) {
    return null;
  }

  const externalSource = place.externalSource
    ? getPlaceExternalSourceFromString(place.externalSource)
    : null;
  if (place.externalSource && !externalSource) {
    return null;
  }

  return {
    id: place.id,
    slug: place.slug,
    name: place.name,
    description: place.description,
    category,
    parentPlaceId: place.parentPlaceId,
    externalSource,
    externalId: place.externalId,
    city: place.city,
    region: place.region,
    country: place.country,
    latitude: fromDecimalOrNull(place.latitude),
    longitude: fromDecimalOrNull(place.longitude),
    address: place.address,
    coverImageUrl: place.coverImageUrl,
    createdByUserId: place.createdByUserId,
    createdAt: place.createdAt,
    updatedAt: place.updatedAt,
  };
}

function toOsmPlaceSearchHitFromRequest(data: SavePlaceFromOsmRequest): OsmPlaceSearchHit | null {
  if (
    typeof data.externalId !== 'string' ||
    !data.externalId.trim() ||
    typeof data.name !== 'string' ||
    !data.name.trim() ||
    typeof data.city !== 'string' ||
    !data.city.trim() ||
    typeof data.country !== 'string' ||
    !data.country.trim() ||
    !isValidPlaceCategory(data.category) ||
    !Number.isFinite(data.latitude) ||
    !Number.isFinite(data.longitude)
  ) {
    return null;
  }

  return {
    source: OSM_PLACE_SEARCH_SOURCE,
    externalId: data.externalId.trim(),
    osmType: data.osmType?.trim() ?? '',
    osmKey: data.osmKey?.trim() ?? '',
    osmValue: data.osmValue?.trim() ?? '',
    name: data.name.trim(),
    category: data.category,
    city: data.city.trim(),
    region: data.region?.trim() ?? null,
    country: data.country.trim(),
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address?.trim() ?? null,
  };
}

function isValidPlaceCategory(category: PlaceCategory): boolean {
  return getPlaceCategoryFromString(category) !== null;
}

function isValidManualPlaceInput(data: SaveManualPlaceRequest): boolean {
  return (
    typeof data.name === 'string' &&
    data.name.trim().length > 0 &&
    typeof data.city === 'string' &&
    data.city.trim().length > 0 &&
    typeof data.country === 'string' &&
    data.country.trim().length > 0
  );
}

function normalizePlaceNameForComparison(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function isPlaceExternalIdentityUniqueViolation(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }
  if (error.code !== 'P2002') {
    return false;
  }
  const target = error.meta?.target;
  if (!Array.isArray(target)) {
    return false;
  }
  return target.includes('external_source') && target.includes('external_id');
}

function isValidExternalIdentity(
  externalSource: PlaceExternalSource | null | undefined,
  externalId: string | null | undefined
): boolean {
  if (externalSource === undefined || externalSource === null) {
    return externalId === undefined || externalId === null || externalId.trim() === '';
  }
  if (externalSource === PlaceExternalSource.MANUAL) {
    return externalId === undefined || externalId === null || externalId.trim() === '';
  }
  return typeof externalId === 'string' && externalId.trim().length > 0;
}

function toDecimalOrNull(value: number | null | undefined): Prisma.Decimal | null {
  if (value === null || value === undefined) {
    return null;
  }
  return new Prisma.Decimal(value);
}

function fromDecimalOrNull(value: Prisma.Decimal | null): number | null {
  if (value === null) {
    return null;
  }
  return value.toNumber();
}
