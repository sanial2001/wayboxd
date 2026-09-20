import { SaveTripRequest } from '@/app/api/model/request/save-trip-request';

export interface SaveTripBodyValidationSuccess {
  error: null;
  body: Omit<SaveTripRequest, 'userId'>;
}

export interface SaveTripBodyValidationFailure {
  error: string;
  body: null;
}

export type SaveTripBodyValidationResult =
  SaveTripBodyValidationSuccess | SaveTripBodyValidationFailure;
