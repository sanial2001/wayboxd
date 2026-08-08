export interface UserModel {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
