/**
 * @swagger
 * /api/public/logs:
 *   post:
 *     summary: Ingest client-side structured logs
 *     description: Accepts browser logs forwarded by clientLogger and writes them to server stdout (Vercel function logs).
 *     tags: [Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - level
 *               - log
 *             properties:
 *               level:
 *                 type: string
 *                 enum: [trace, debug, info, warn, error, fatal]
 *               log:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Log accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Log received
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Failed to process log
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
