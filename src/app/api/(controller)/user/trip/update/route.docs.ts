/**
 * @swagger
 * /api/user/trip/update:
 *   put:
 *     summary: Update a trip owned by the signed-in user
 *     description: Updates title, blurb, and/or outbound URL. Cover, tag, duration, and tripDate cannot be changed. userId is taken from the session.
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
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 minimum: 1
 *               title:
 *                 type: string
 *               blurb:
 *                 type: string
 *                 nullable: true
 *               outboundUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Trip updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TripModel'
 *                 status:
 *                   type: integer
 *                   example: 200
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
 *       403:
 *         description: Trip is owned by another user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Trip not found
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
