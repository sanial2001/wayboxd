import { buildTripCoverUploadPathname } from '@/app/_util/trip-cover-upload-path';
import { compressImageForUpload } from '@/app/_util/compress-image-for-upload';
import {
  isTripCoverAllowedContentType,
  TRIP_COVER_COMPRESS_QUALITY,
  TRIP_COVER_MAX_BYTES,
  TRIP_COVER_MAX_LONG_EDGE_PX,
  TRIP_COVER_MAX_SOURCE_BYTES,
} from '@/app/api/model/enums/trip-cover-upload';
import {
  SaveDraftTripBodyRequest,
  SaveTripBodyRequest,
} from '@/app/api/model/request/save-trip-request';
import { UpdateTripBodyRequest } from '@/app/api/model/request/update-trip-request';
import { ApiResponse } from '@/app/api/model/response/api-response';
import { TripCoverUploadResult } from '@/app/api/model/response/trip-cover-upload-result';
import { TripModel } from '@/app/api/model/response/trip-model';
import { upload } from '@vercel/blob/client';

export async function saveTripClient(
  request: SaveTripBodyRequest
): Promise<ApiResponse<TripModel>> {
  const response = await fetch('/api/user/trip/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}

export async function saveDraftTripClient(
  request: SaveDraftTripBodyRequest
): Promise<ApiResponse<TripModel>> {
  const response = await fetch('/api/user/trip/save/draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}

export async function updateTripClient(
  tripId: number,
  request: UpdateTripBodyRequest
): Promise<ApiResponse<TripModel>> {
  const response = await fetch(`/api/user/trip/update/${tripId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  return await response.json();
}

export async function uploadTripCoverClient(
  userId: number,
  file: File
): Promise<TripCoverUploadResult> {
  if (!isTripCoverAllowedContentType(file.type)) {
    throw new Error('Cover must be a JPEG, PNG, or WebP image');
  }
  if (file.size > TRIP_COVER_MAX_SOURCE_BYTES) {
    throw new Error('Cover must be 10 MB or smaller');
  }

  const compressedFile = await compressImageForUpload(file, {
    maxLongEdgePx: TRIP_COVER_MAX_LONG_EDGE_PX,
    quality: TRIP_COVER_COMPRESS_QUALITY,
    maxOutputBytes: TRIP_COVER_MAX_BYTES,
  });

  const pathname = buildTripCoverUploadPathname(userId, compressedFile.name);
  const blob = await upload(pathname, compressedFile, {
    access: 'public',
    handleUploadUrl: '/api/user/trip/cover',
    contentType: compressedFile.type,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType ?? null,
  };
}
