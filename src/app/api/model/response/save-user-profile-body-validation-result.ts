import { SaveUserProfileBodyRequest } from '@/app/api/model/request/save-user-profile-request';

export interface SaveUserProfileBodyValidationSuccess {
  error: null;
  body: SaveUserProfileBodyRequest;
}

export interface SaveUserProfileBodyValidationFailure {
  error: string;
  body: null;
}

export type SaveUserProfileBodyValidationResult =
  SaveUserProfileBodyValidationSuccess | SaveUserProfileBodyValidationFailure;
