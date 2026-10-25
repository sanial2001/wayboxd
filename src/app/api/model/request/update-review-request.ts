export interface UpdateReviewRequest {
  title?: string;
  body?: string | null;
  rating?: number;
  wouldGoAgain?: boolean | null;
  visitDate?: Date | null;
  tags?: string[];
}
