# Add public user sign-in API and client

## Summary

- Adds `POST /api/public/user-signin` to validate username/password and return `UserModel` (password hash is never included).
- Adds `authenticateUser` in the user service so credential checks stay in the service layer, not the route handler.
- Adds `userSigninClient` next to `userSignupClient` so UI code can call the route through the API client instead of inline `fetch`.
- Updates the agent domain map with the new public sign-in endpoint.

This route verifies credentials only. It does **not** create a NextAuth JWT session. Session login still goes through `/api/auth/*` (`signIn('credentials', …)`).

## Test plan

- [ ] `POST /api/public/user-signin` with a missing or blank username/password returns `400` and a field-specific error.
- [ ] `POST /api/public/user-signin` with an unknown username or wrong password returns `401` with `Invalid username or password` (does not reveal which field failed).
- [ ] `POST /api/public/user-signin` with valid credentials returns `200` and a `UserModel` that includes `id`, `username`, and `email`, with no `password` field.
- [ ] `userSigninClient({ username, password })` returns a typed `ApiResponse<UserModel>` the UI can branch on via `result.error` / `result.data`.
- [ ] Confirm a successful sign-in response does **not** set a NextAuth session cookie; protected `/api/*` routes still require `/api/auth/*`.

## Notes

- Username is trimmed before lookup because signup stores `username.trim()`. NextAuth `authorize` still uses the raw `credentials.username`, so a padded username can succeed here and then fail `signIn('credentials')` with the same payload.
