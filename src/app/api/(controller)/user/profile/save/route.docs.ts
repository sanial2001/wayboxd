/**
 * @swagger
 * /api/user/profile/save:
 *   post:
 *     summary: Save the signed-in user's profile
 *     description: Creates or updates the profile for the authenticated user. userId is taken from the session.
 *     tags: [User]
 *     security:
 *       - sessionCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 nullable: true
 *               bio:
 *                 type: string
 *                 nullable: true
 *               avatarUrl:
 *                 type: string
 *                 nullable: true
 *               instagramProfileUrl:
 *                 type: string
 *                 nullable: true
 *               xProfileUrl:
 *                 type: string
 *                 nullable: true
 *               otherProfileUrl:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UserProfileModel'
 *                 status:
 *                   type: integer
 *                   example: 200
 *       201:
 *         description: Profile created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UserProfileModel'
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
