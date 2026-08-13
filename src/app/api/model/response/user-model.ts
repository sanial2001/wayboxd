export interface UserModel {
  id: number;
  email: string | null;
  username: string;
  createdAt: Date;
  updatedAt: Date | null;
}
