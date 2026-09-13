/**
 * @swagger
 * /api/place/save/from-osm:
 *   post:
 *     summary: Find or create a place from an OSM search hit
 *     description: Idempotent by OSM external id. Returns the existing row if already saved.
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
 *               - externalId
 *               - osmType
 *               - osmKey
 *               - osmValue
 *               - name
 *               - category
 *               - city
 *               - country
 *               - latitude
 *               - longitude
 *             properties:
 *               externalId:
 *                 type: string
 *               osmType:
 *                 type: string
 *               osmKey:
 *                 type: string
 *               osmValue:
 *                 type: string
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
 *               longitude:
 *                 type: number
 *               address:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Place found or created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/PlaceModel'
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Invalid payload or save failed
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
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
