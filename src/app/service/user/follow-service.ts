import { SaveFollowRequest } from '@/app/api/model/request/save-follow-request';
import { FollowModel } from '@/app/api/model/response/follow-model';
import prisma from '@/app/service/_lib/prisma';
import { Follow } from '@prisma/client';

export async function getFollowByFollowerIdAndFolloweeId(
  followerId: number,
  followeeId: number
): Promise<FollowModel | null> {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followeeId: { followerId, followeeId },
    },
  });
  if (!follow) {
    return null;
  }
  return mapFollowEntityToModel(follow);
}

export async function getFollowsByFollowerId(followerId: number): Promise<FollowModel[]> {
  const follows = await prisma.follow.findMany({
    where: { followerId },
    orderBy: { createdAt: 'desc' },
  });
  return mapFollowEntitiesToModels(follows);
}

export async function getFollowsByFolloweeId(followeeId: number): Promise<FollowModel[]> {
  const follows = await prisma.follow.findMany({
    where: { followeeId },
    orderBy: { createdAt: 'desc' },
  });
  return mapFollowEntitiesToModels(follows);
}

export async function saveFollow(data: SaveFollowRequest): Promise<FollowModel | null> {
  if (data.followerId === data.followeeId) {
    return null;
  }

  const follow = await prisma.follow.create({
    data: {
      followerId: data.followerId,
      followeeId: data.followeeId,
      createdAt: new Date(),
    },
  });
  return mapFollowEntityToModel(follow);
}

export async function deleteFollow(
  followerId: number,
  followeeId: number
): Promise<FollowModel | null> {
  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followeeId: { followerId, followeeId },
    },
  });
  if (!existing) {
    return null;
  }

  const follow = await prisma.follow.delete({
    where: {
      followerId_followeeId: { followerId, followeeId },
    },
  });
  return mapFollowEntityToModel(follow);
}

function mapFollowEntitiesToModels(follows: Follow[]): FollowModel[] {
  return follows.map(mapFollowEntityToModel);
}

function mapFollowEntityToModel(follow: Follow): FollowModel {
  return {
    followerId: follow.followerId,
    followeeId: follow.followeeId,
    createdAt: follow.createdAt,
  };
}
