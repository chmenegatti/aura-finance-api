import { Router } from "express";

import { getProfile } from "./controllers/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve the profile of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Authentication failed or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/me", authMiddleware, getProfile);

export default router;
