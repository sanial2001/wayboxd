/**
 * @swagger
 * /api/place/save/manual:
 *   post:
 *     summary: Add a place manually when it is not in search results
 *     description: Detects likely duplicates by normalized name and city/country. Sets createdByUserId from the session.
 *     tags: [Place]
 *     security:
 *       - sessionCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - city
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 $ref: '#/components/schemas/PlaceCategory'
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               region:
 *                 type: string
 *                 nullable: true
 *               latitude:
 *                 type: number
 *                 nullable: true
 *               longitude:
 *                 type: number
 *                 nullable: true
 *               address:
 *                 type: string
 *                 nullable: true
 *               createdByUserId:
 *                 type: integer
 *                 nullable: true
 *                 description: Ignored; taken from the authenticated session
 *     responses:
 *       201:
 *         description: Place created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ManualPlaceSaveResult'
 *                 status:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Validation error or save failed
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
 *       409:
 *         description: Likely duplicate; returns candidate places
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ManualPlaceSaveResult'
 *                 status:
 *                   type: integer
 *                   example: 409
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
