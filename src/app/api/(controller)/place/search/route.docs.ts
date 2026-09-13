/**
 * @swagger
 * /api/place/search:
 *   get:
 *     summary: Search places in the local database and OpenStreetMap (Photon)
 *     description: Requires an authenticated session. Returns local matches plus OSM hits not already stored locally.
 *     tags: [Place]
 *     security:
 *       - sessionCookie: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search query (minimum 2 characters)
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/PlaceSearchResult'
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Query too short
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Not signed in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Search failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
