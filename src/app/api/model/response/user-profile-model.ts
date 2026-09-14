export interface UserProfileModel {
  userId: number;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  instagramProfileUrl: string | null;
  xProfileUrl: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
