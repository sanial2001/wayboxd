import { buildAvatarUploadPathname } from '@/app/_util/avatar-upload-path';
import { compressImageForUpload } from '@/app/_util/compress-image-for-upload';
import {
  isUserAvatarAllowedContentType,
  USER_AVATAR_COMPRESS_QUALITY,
  USER_AVATAR_MAX_BYTES,
  USER_AVATAR_MAX_LONG_EDGE_PX,
  USER_AVATAR_MAX_SOURCE_BYTES,
} from '@/app/api/model/enums/user-avatar-upload';
import { SaveUserProfileBodyRequest } from '@/app/api/model/request/save-user-profile-request';
import { UserAvatarUploadResult } from '@/app/api/model/response/user-avatar-upload-result';
import { upload } from '@vercel/blob/client';
import { UserSigninRequest } from '@/app/api/model/request/user-signin-request';
import { UserSignupRequest } from '@/app/api/model/request/user-signup-request';
import { ApiResponse } from '@/app/api/model/response/api-response';
import { UserModel } from '@/app/api/model/response/user-model';
import { UserProfileModel } from '@/app/api/model/response/user-profile-model';

export async function userSignupClient(
  userSignupRequest: UserSignupRequest
): Promise<ApiResponse<UserModel>> {
  try {
    const response = await fetch('/api/public/user-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSignupRequest),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function userSigninClient(
  userSigninRequest: UserSigninRequest
): Promise<ApiResponse<UserModel>> {
  try {
    const response = await fetch('/api/public/user-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSigninRequest),
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function saveUserProfileClient(
  request: SaveUserProfileBodyRequest
): Promise<ApiResponse<UserProfileModel>> {
  const response = await fetch('/api/user/profile/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}

export async function uploadUserAvatarClient(
  userId: number,
  file: File
): Promise<UserAvatarUploadResult> {
  if (!isUserAvatarAllowedContentType(file.type)) {
    throw new Error('Avatar must be a JPEG, PNG, or WebP image');
  }
  if (file.size > USER_AVATAR_MAX_SOURCE_BYTES) {
    throw new Error('Avatar must be 10 MB or smaller');
  }

  const compressedFile = await compressImageForUpload(file, {
    maxLongEdgePx: USER_AVATAR_MAX_LONG_EDGE_PX,
    quality: USER_AVATAR_COMPRESS_QUALITY,
    maxOutputBytes: USER_AVATAR_MAX_BYTES,
  });

  const pathname = buildAvatarUploadPathname(userId, compressedFile.name);
  const blob = await upload(pathname, compressedFile, {
    access: 'public',
    handleUploadUrl: '/api/user/profile/avatar',
    contentType: compressedFile.type,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType ?? null,
  };
}
