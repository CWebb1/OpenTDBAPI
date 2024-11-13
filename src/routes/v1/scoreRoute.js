import express from "express";
import { getAllScores } from "../../controllers/v1/scoreController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Scores
 *   description: Quiz scores management
 */

/**
 * @swagger
 * /api/scores:
 *   get:
 *     tags: [Scores]
 *     summary: Get all quiz scores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all quiz scores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   score:
 *                     type: integer
 *                   user:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       emailAddress:
 *                         type: string
 *                   quiz:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       difficulty:
 *                         type: string
 *                         enum: [easy, medium, hard]
 *                       type:
 *                         type: string
 *                         enum: [multiple, boolean]
 *       401:
 *         description: Unauthorized
 */
router.get("/", getAllScores);

export default router;
