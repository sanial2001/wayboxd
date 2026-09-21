/**
 * @swagger
 * /api/user/trip/save/draft:
 *   post:
 *     summary: Save a trip draft for the signed-in user
 *     description: Creates an unpublished trip owned by the authenticated user. Cover, outbound URL, and trip date may be omitted. userId is taken from the session.
 *     tags: [Trip]
 *     security:
 *       - sessionCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               coverImageUrl:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *               outboundUrl:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *               tripDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               blurb:
 *                 type: string
 *                 nullable: true
 *               tag:
 *                 type: string
 *                 nullable: true
 *               duration:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Draft trip created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TripModel'
 *                 status:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Validation error
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
