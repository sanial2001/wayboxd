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
