import { isValidReviewRating } from '@/app/api/model/enums/review-rating';
import { SaveReviewRequest } from '@/app/api/model/request/save-review-request';
import { UpdateReviewRequest } from '@/app/api/model/request/update-review-request';
import { ReviewModel } from '@/app/api/model/response/review-model';
import { TripPlaceModel } from '@/app/api/model/response/trip-place-model';
import prisma from '@/app/service/_lib/prisma';
import { Place, Prisma } from '@prisma/client';

const reviewWithPlace = { place: true } satisfies Prisma.ReviewInclude;

type ReviewWithPlace = Prisma.ReviewGetPayload<{ include: typeof reviewWithPlace }>;

export async function getReviewById(id: number): Promise<ReviewModel | null> {
  const review = await prisma.review.findUnique({
    where: { id },
    include: reviewWithPlace,
  });
  if (!review) {
    return null;
  }
  return mapReviewEntityToModel(review);
}

export async function getReviewByUserIdAndPlaceId(
  userId: number,
  placeId: number
): Promise<ReviewModel | null> {
  const review = await prisma.review.findUnique({
    where: {
      userId_placeId: { userId, placeId },
    },
    include: reviewWithPlace,
  });
  if (!review) {
    return null;
  }
  return mapReviewEntityToModel(review);
}

export async function getReviewsByPlaceId(placeId: number): Promise<ReviewModel[]> {
  const reviews = await prisma.review.findMany({
    where: { placeId },
    orderBy: { createdAt: 'desc' },
    include: reviewWithPlace,
  });
  return mapReviewEntitiesToModels(reviews);
}

export async function getReviewsByUserId(userId: number): Promise<ReviewModel[]> {
  const reviews = await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: reviewWithPlace,
  });
  return mapReviewEntitiesToModels(reviews);
}

export async function countReviewsByUserId(userId: number): Promise<number> {
  return prisma.review.count({
    where: { userId },
  });
}

export async function saveReview(data: SaveReviewRequest): Promise<ReviewModel | null> {
  if (!isValidReviewRating(data.rating)) {
    return null;
  }

  const review = await prisma.review.create({
    data: {
      userId: data.userId,
      placeId: data.placeId,
      title: data.title,
      body: data.body ?? null,
      rating: data.rating,
      wouldGoAgain: data.wouldGoAgain ?? null,
      visitDate: data.visitDate ?? null,
      tags: data.tags ?? [],
      createdAt: new Date(),
    },
    include: reviewWithPlace,
  });
  return mapReviewEntityToModel(review);
}

export async function updateReview(
  id: number,
  data: UpdateReviewRequest
): Promise<ReviewModel | null> {
  if (data.rating !== undefined && !isValidReviewRating(data.rating)) {
    return null;
  }

  const existing = await prisma.review.findUnique({
    where: { id },
  });
  if (!existing) {
    return null;
  }

  const review = await prisma.review.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.body !== undefined ? { body: data.body } : {}),
      ...(data.rating !== undefined ? { rating: data.rating } : {}),
      ...(data.wouldGoAgain !== undefined ? { wouldGoAgain: data.wouldGoAgain } : {}),
      ...(data.visitDate !== undefined ? { visitDate: data.visitDate } : {}),
      ...(data.tags !== undefined ? { tags: data.tags } : {}),
      updatedAt: new Date(),
    },
    include: reviewWithPlace,
  });
  return mapReviewEntityToModel(review);
}

export async function deleteReview(id: number): Promise<ReviewModel | null> {
  const existing = await prisma.review.findUnique({
    where: { id },
  });
  if (!existing) {
    return null;
  }

  const review = await prisma.review.delete({
    where: { id },
    include: reviewWithPlace,
  });
  return mapReviewEntityToModel(review);
}

function mapReviewEntitiesToModels(reviews: ReviewWithPlace[]): ReviewModel[] {
  return reviews.map(mapReviewEntityToModel);
}

function mapReviewEntityToModel(review: ReviewWithPlace): ReviewModel {
  return {
    id: review.id,
    userId: review.userId,
    placeId: review.placeId,
    title: review.title,
    body: review.body,
    rating: review.rating,
    wouldGoAgain: review.wouldGoAgain,
    visitDate: review.visitDate,
    tags: review.tags,
    place: mapReviewPlace(review.place),
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

function mapReviewPlace(place: Place): TripPlaceModel {
  return {
    id: place.id,
    name: place.name,
    city: place.city,
    region: place.region,
    country: place.country,
  };
}
