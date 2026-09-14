/** API / client body — userId comes from the session, not the payload. */
export interface SaveUserProfileBodyRequest {
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  instagramProfileUrl?: string | null;
  xProfileUrl?: string | null;
}

/** Service-layer create input for `saveUserProfile` (create only). */
export interface SaveUserProfileRequest extends SaveUserProfileBodyRequest {
  userId: number;
}
