/**
 * @swagger
 * /api/user/review/save:
 *   post:
 *     summary: Save a review for the signed-in user
 *     description: Creates one review for a place, owned by the authenticated user. userId is taken from the session. A user can review each place once.
 *     tags: [Review]
 *     security:
 *       - sessionCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - placeId
 *               - title
 *               - rating
 *             properties:
 *               placeId:
 *                 type: integer
 *                 minimum: 1
 *               title:
 *                 type: string
 *                 maxLength: 160
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               body:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 2000
 *               wouldGoAgain:
 *                 type: boolean
 *                 nullable: true
 *               visitDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ReviewModel'
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
