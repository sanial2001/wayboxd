export interface ReviewModel {
  id: number;
  userId: number;
  placeId: number;
  title: string;
  body: string | null;
  rating: number;
  wouldGoAgain: boolean | null;
  visitDate: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date | null;
}
