/**
 * @swagger
 * /api/user/trip/cover:
 *   post:
 *     summary: Vercel Blob client upload handler for trip cover photos
 *     description: |
 *       Used by `@vercel/blob/client` `upload()` — not a normal JSON API body.
 *       The browser calls this route to obtain a client token, then uploads directly to Blob.
 *       After upload, persist the returned URL as `coverImageUrl` via `POST /api/user/trip/save`.
 *     tags: [Trip]
 *     security:
 *       - sessionCookie: []
 *     responses:
 *       200:
 *         description: Client token or upload completion payload (Vercel Blob protocol)
 *       401:
 *         description: Not signed in (token generation only)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       400:
 *         description: Invalid upload request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
