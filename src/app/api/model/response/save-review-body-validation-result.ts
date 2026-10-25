import { SaveReviewRequest } from '@/app/api/model/request/save-review-request';

export interface SaveReviewBodyValidationSuccess {
  error: null;
  body: Omit<SaveReviewRequest, 'userId'>;
}

export interface SaveReviewBodyValidationFailure {
  error: string;
  body: null;
}

export type SaveReviewBodyValidationResult =
  SaveReviewBodyValidationSuccess | SaveReviewBodyValidationFailure;
