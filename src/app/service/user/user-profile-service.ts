import { SaveUserProfileRequest } from '@/app/api/model/request/save-user-profile-request';
import { UpdateUserProfileRequest } from '@/app/api/model/request/update-user-profile-request';
import { PublicUserProfileView } from '@/app/api/model/response/public-user-profile-view';
import { UserProfileModel } from '@/app/api/model/response/user-profile-model';
import prisma from '@/app/service/_lib/prisma';
import { UserProfile } from '@prisma/client';
import { countFollowersByUserId, countFollowingByUserId } from '@/app/service/user/follow-service';
import { getUserByUsername } from '@/app/service/user/user-service';

export async function getUserProfileByUserId(userId: number): Promise<UserProfileModel | null> {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  });
  if (!profile) {
    return null;
  }
  return mapUserProfileEntityToModel(profile);
}

export async function getPublicUserProfileByUsername(
  username: string
): Promise<PublicUserProfileView | null> {
  const user = await getUserByUsername(username);
  if (!user) {
    return null;
  }

  const [profile, followerCount, followingCount] = await Promise.all([
    getUserProfileByUserId(user.id),
    countFollowersByUserId(user.id),
    countFollowingByUserId(user.id),
  ]);

  return {
    userId: user.id,
    username: user.username,
    displayName: profile?.displayName ?? null,
    bio: profile?.bio ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    instagramProfileUrl: profile?.instagramProfileUrl ?? null,
    xProfileUrl: profile?.xProfileUrl ?? null,
    followerCount,
    followingCount,
    joinedAt: user.createdAt,
  };
}

export async function saveUserProfile(data: SaveUserProfileRequest): Promise<UserProfileModel> {
  const profile = await prisma.userProfile.create({
    data: {
      userId: data.userId,
      displayName: data.displayName ?? null,
      bio: data.bio ?? null,
      avatarUrl: data.avatarUrl ?? null,
      instagramProfileUrl: data.instagramProfileUrl ?? null,
      xProfileUrl: data.xProfileUrl ?? null,
      createdAt: new Date(),
    },
  });
  return mapUserProfileEntityToModel(profile);
}

export async function updateUserProfile(
  userId: number,
  data: UpdateUserProfileRequest
): Promise<UserProfileModel | null> {
  const existing = await prisma.userProfile.findUnique({
    where: { userId },
  });
  if (!existing) {
    return null;
  }

  const profile = await prisma.userProfile.update({
    where: { userId },
    data: {
      ...(data.displayName !== undefined ? { displayName: data.displayName } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
      ...(data.instagramProfileUrl !== undefined
        ? { instagramProfileUrl: data.instagramProfileUrl }
        : {}),
      ...(data.xProfileUrl !== undefined ? { xProfileUrl: data.xProfileUrl } : {}),
      updatedAt: new Date(),
    },
  });
  return mapUserProfileEntityToModel(profile);
}

function mapUserProfileEntityToModel(profile: UserProfile): UserProfileModel {
  return {
    userId: profile.userId,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    instagramProfileUrl: profile.instagramProfileUrl,
    xProfileUrl: profile.xProfileUrl,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}
