import { TripStatus } from '@/app/api/model/enums/trip-status';

export interface UpdateTripValidatedBody {
  title?: string;
  blurb?: string | null;
  coverImageUrl?: string;
  outboundUrl?: string | null;
  tag?: string | null;
  duration?: string | null;
  tripDate?: Date;
  status?: TripStatus;
}

export interface UpdateTripBodyValidationSuccess {
  error: null;
  body: UpdateTripValidatedBody;
}

export interface UpdateTripBodyValidationFailure {
  error: string;
  body: null;
}

export type UpdateTripBodyValidationResult =
  UpdateTripBodyValidationSuccess | UpdateTripBodyValidationFailure;
