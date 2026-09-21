export interface PublicUserProfileView {
  userId: number;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  instagramProfileUrl: string | null;
  xProfileUrl: string | null;
  otherProfileUrl: string | null;
  followerCount: number;
  followingCount: number;
  joinedAt: Date;
}
