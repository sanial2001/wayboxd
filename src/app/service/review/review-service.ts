import { SaveReviewRequest } from '@/app/api/model/request/save-review-request';
import { UpdateReviewRequest } from '@/app/api/model/request/update-review-request';
import { ReviewModel } from '@/app/api/model/response/review-model';
import prisma from '@/app/service/_lib/prisma';
import { Review } from '@prisma/client';

export async function getReviewById(id: number): Promise<ReviewModel | null> {
  const review = await prisma.review.findUnique({
    where: { id },
  });
  if (!review) {
    return null;
  }
  return mapReviewEntityToModel(review);
}

export async function getReviewsByUserId(userId: number): Promise<ReviewModel[]> {
  const reviews = await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return mapReviewEntitiesToModels(reviews);
}

export async function countReviewsByUserId(userId: number): Promise<number> {
  return prisma.review.count({
    where: { userId },
  });
}

export async function saveReview(data: SaveReviewRequest): Promise<ReviewModel> {
  const review = await prisma.review.create({
    data: {
      userId: data.userId,
      body: data.body,
      createdAt: new Date(),
    },
  });
  return mapReviewEntityToModel(review);
}

export async function updateReview(
  id: number,
  data: UpdateReviewRequest
): Promise<ReviewModel | null> {
  const existing = await prisma.review.findUnique({
    where: { id },
  });
  if (!existing) {
    return null;
  }

  const review = await prisma.review.update({
    where: { id },
    data: {
      ...(data.body !== undefined ? { body: data.body } : {}),
      updatedAt: new Date(),
    },
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
  });
  return mapReviewEntityToModel(review);
}

function mapReviewEntitiesToModels(reviews: Review[]): ReviewModel[] {
  return reviews.map(mapReviewEntityToModel);
}

function mapReviewEntityToModel(review: Review): ReviewModel {
  return {
    id: review.id,
    userId: review.userId,
    body: review.body,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}
