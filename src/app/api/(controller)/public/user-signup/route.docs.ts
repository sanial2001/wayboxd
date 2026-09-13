/**
 * @swagger
 * /api/public/user-signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [User]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address
 *               username:
 *                 type: string
 *                 description: Unique username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Account password
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/UserModel'
 *                 status:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Validation error or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Failed to sign up
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
