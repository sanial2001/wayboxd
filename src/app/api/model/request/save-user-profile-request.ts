export interface SaveUserProfileRequest {
  userId: number;
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  instagramProfileUrl?: string | null;
  xProfileUrl?: string | null;
}
