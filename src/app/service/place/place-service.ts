import { PlaceCategory, getPlaceCategoryFromString } from '@/app/api/model/enums/place-category';
import { SavePlaceRequest } from '@/app/api/model/request/save-place-request';
import { UpdatePlaceRequest } from '@/app/api/model/request/update-place-request';
import {
  OSM_PLACE_SEARCH_SOURCE,
  OsmPlaceSearchHit,
} from '@/app/api/model/response/osm-place-search-hit';
import { PlaceModel } from '@/app/api/model/response/place-model';
import { PlaceSearchResult } from '@/app/api/model/response/place-search-result';
import { searchOsmPlacesByQuery } from '@/app/service/place/photon-client';
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
    searchOsmPlacesByQuery(trimmedQuery),
  ]);

  const osm = await excludeOsmHitsAlreadyInDatabase(osmHits);
  return { local, osm };
}

export async function savePlace(data: SavePlaceRequest): Promise<PlaceModel | null> {
  if (!isValidPlaceCategory(data.category)) {
    return null;
  }

  const place = await prisma.place.create({
    data: {
      slug: data.slug,
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

  return {
    id: place.id,
    slug: place.slug,
    name: place.name,
    description: place.description,
    category,
    parentPlaceId: place.parentPlaceId,
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

function isValidPlaceCategory(category: PlaceCategory): boolean {
  return getPlaceCategoryFromString(category) !== null;
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
