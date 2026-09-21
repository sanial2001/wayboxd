/**
 * @swagger
 * /api/user/trip/delete/{tripId}:
 *   delete:
 *     summary: Soft-delete a trip owned by the signed-in user
 *     description: Sets status to Deleted. The row is kept; publishedAt is unchanged. tripId is a path param; userId is taken from the session.
 *     tags: [Trip]
 *     security:
 *       - sessionCookie: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip marked as deleted
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
 *         description: Validation error or trip is already deleted
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
