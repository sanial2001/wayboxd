export interface ReviewModel {
  id: number;
  userId: number;
  body: string;
  createdAt: Date;
  updatedAt: Date | null;
}
