import { TripStatus } from '@/app/api/model/enums/trip-status';
import { SaveTripRequest } from '@/app/api/model/request/save-trip-request';
import { UpdateTripRequest } from '@/app/api/model/request/update-trip-request';
import { TripModel } from '@/app/api/model/response/trip-model';
import prisma from '@/app/service/_lib/prisma';
import { Trip } from '@prisma/client';

export async function getTripById(id: number): Promise<TripModel | null> {
  const trip = await prisma.trip.findUnique({
    where: { id },
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
  });
  return mapTripEntitiesToModels(trips);
}

export async function getPublishedTripsByUserId(userId: number): Promise<TripModel[]> {
  const trips = await prisma.trip.findMany({
    where: {
      userId,
      status: TripStatus.PUBLISHED,
    },
    orderBy: { tripDate: 'desc' },
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
      outboundUrl: data.outboundUrl,
      tag: data.tag ?? null,
      duration: data.duration ?? null,
      tripDate: data.tripDate,
      status: data.status ?? TripStatus.DRAFT,
      publishedAt: data.publishedAt ?? null,
      createdAt: new Date(),
    },
  });
  return mapTripEntityToModel(trip);
}

export async function updateTrip(id: number, data: UpdateTripRequest): Promise<TripModel | null> {
  const existing = await prisma.trip.findUnique({
    where: { id },
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
      updatedAt: new Date(),
    },
  });
  return mapTripEntityToModel(trip);
}

export async function deleteTrip(id: number): Promise<TripModel | null> {
  const existing = await prisma.trip.findUnique({
    where: { id },
  });
  if (!existing) {
    return null;
  }

  const trip = await prisma.trip.delete({
    where: { id },
  });
  return mapTripEntityToModel(trip);
}

function mapTripEntitiesToModels(trips: Trip[]): TripModel[] {
  return trips.map(mapTripEntityToModel);
}

function mapTripEntityToModel(trip: Trip): TripModel {
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
    status: trip.status as TripStatus,
    publishedAt: trip.publishedAt,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}
