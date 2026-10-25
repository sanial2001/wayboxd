import { SaveReviewBodyRequest } from '@/app/api/model/request/save-review-request';

export interface SaveReviewBodyValidationSuccess {
  error: null;
  body: SaveReviewBodyRequest;
}

export interface SaveReviewBodyValidationFailure {
  error: string;
  body: null;
}

export type SaveReviewBodyValidationResult =
  SaveReviewBodyValidationSuccess | SaveReviewBodyValidationFailure;
