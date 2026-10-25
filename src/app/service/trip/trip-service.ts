import { TripStatus } from '@/app/api/model/enums/trip-status';
import { SaveTripRequest } from '@/app/api/model/request/save-trip-request';
import { UpdateTripRequest } from '@/app/api/model/request/update-trip-request';
import { TripModel } from '@/app/api/model/response/trip-model';
import { TripPlaceModel } from '@/app/api/model/response/trip-place-model';
import { sortTripsByTripDateDesc } from '@/app/_util/sort-trips-by-trip-date';
import prisma from '@/app/service/_lib/prisma';
import { Place, Prisma } from '@prisma/client';

const tripWithPlace = { place: true } satisfies Prisma.TripInclude;

export async function getTripById(id: number): Promise<TripModel | null> {
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: tripWithPlace,
  });
  if (!trip) {
    return null;
  }
  return mapTripEntityToModel(trip);
}

export async function getTripsByUserId(userId: number): Promise<TripModel[]> {
  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { tripDate: 'desc' },
    include: tripWithPlace,
  });
  return mapTripEntitiesToModels(trips);
}

export async function countPublishedTripsByUserId(userId: number): Promise<number> {
  return prisma.trip.count({
    where: {
      userId,
      status: TripStatus.PUBLISHED,
    },
  });
}

export async function getPublishedTripsByUserId(userId: number): Promise<TripModel[]> {
  const trips = await prisma.trip.findMany({
    where: {
      userId,
      status: TripStatus.PUBLISHED,
    },
    orderBy: { tripDate: 'desc' },
    include: tripWithPlace,
  });
  return sortTripsByTripDateDesc(mapTripEntitiesToModels(trips));
}

export async function getDraftTripsByUserId(userId: number): Promise<TripModel[]> {
  const trips = await prisma.trip.findMany({
    where: {
      userId,
      status: TripStatus.DRAFT,
    },
    orderBy: [{ updatedAt: { sort: 'desc', nulls: 'last' } }, { createdAt: 'desc' }],
    include: tripWithPlace,
  });
  return mapTripEntitiesToModels(trips);
}

export async function saveTrip(data: SaveTripRequest): Promise<TripModel> {
  const trip = await prisma.trip.create({
    data: {
      userId: data.userId,
      title: data.title,
      blurb: data.blurb ?? null,
      coverImageUrl: data.coverImageUrl,
      outboundUrl: data.outboundUrl ?? null,
      tag: data.tag ?? null,
      duration: data.duration ?? null,
      tripDate: data.tripDate,
      placeId: data.placeId,
      status: data.status ?? TripStatus.DRAFT,
      publishedAt: data.publishedAt ?? null,
      createdAt: new Date(),
    },
    include: tripWithPlace,
  });
  return mapTripEntityToModel(trip);
}

export async function updateTrip(id: number, data: UpdateTripRequest): Promise<TripModel | null> {
  const existing = await prisma.trip.findUnique({
    where: { id },
    include: tripWithPlace,
  });
  if (!existing) {
    return null;
  }

  const trip = await prisma.trip.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.blurb !== undefined ? { blurb: data.blurb } : {}),
      ...(data.coverImageUrl !== undefined ? { coverImageUrl: data.coverImageUrl } : {}),
      ...(data.outboundUrl !== undefined ? { outboundUrl: data.outboundUrl } : {}),
      ...(data.tag !== undefined ? { tag: data.tag } : {}),
      ...(data.duration !== undefined ? { duration: data.duration } : {}),
      ...(data.tripDate !== undefined ? { tripDate: data.tripDate } : {}),
      ...(data.placeId !== undefined ? { placeId: data.placeId } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.publishedAt !== undefined ? { publishedAt: data.publishedAt } : {}),
      updatedAt: new Date(),
    },
    include: tripWithPlace,
  });
  return mapTripEntityToModel(trip);
}

export async function deleteTrip(id: number): Promise<TripModel | null> {
  const existing = await prisma.trip.findUnique({
    where: { id },
    include: tripWithPlace,
  });
  if (!existing) {
    return null;
  }

  const trip = await prisma.trip.delete({
    where: { id },
    include: tripWithPlace,
  });
  return mapTripEntityToModel(trip);
}

function mapTripEntitiesToModels(
  trips: Prisma.TripGetPayload<{ include: typeof tripWithPlace }>[]
): TripModel[] {
  return trips.map(mapTripEntityToModel);
}

function mapTripEntityToModel(
  trip: Prisma.TripGetPayload<{ include: typeof tripWithPlace }>
): TripModel {
  return {
    id: trip.id,
    userId: trip.userId,
    title: trip.title,
    blurb: trip.blurb,
    coverImageUrl: trip.coverImageUrl,
    outboundUrl: trip.outboundUrl,
    tag: trip.tag,
    duration: trip.duration,
    tripDate: trip.tripDate,
    placeId: trip.placeId,
    place: mapTripPlace(trip.place),
    status: trip.status as TripStatus,
    publishedAt: trip.publishedAt,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}

function mapTripPlace(place: Place | null): TripPlaceModel | null {
  if (!place) {
    return null;
  }
  return {
    id: place.id,
    name: place.name,
    city: place.city,
    region: place.region,
    country: place.country,
  };
}
