/** API / client body — userId comes from the session, not the payload. */
export interface SaveReviewBodyRequest {
  placeId: number;
  title: string;
  rating: number;
  body?: string | null;
  wouldGoAgain?: boolean | null;
  visitDate?: string | null;
  tags?: string[];
}

/** Service-layer create input for `saveReview` (create only). */
export interface SaveReviewRequest {
  userId: number;
  placeId: number;
  title: string;
  rating: number;
  body?: string | null;
  wouldGoAgain?: boolean | null;
  visitDate?: Date | null;
  tags?: string[];
}
