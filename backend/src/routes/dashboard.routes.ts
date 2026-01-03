import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { DashboardParamsDto } from "../dtos/dashboard-params.dto.js";
import { getDashboardCharts, getDashboardSummary } from "../controllers/dashboard.controller.js";

const router = Router();

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get the financial summary for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponseSuccess'
 */
router.get(
  "/summary",
  authMiddleware,
  validationMiddleware(DashboardParamsDto, "query"),
  getDashboardSummary,
);

/**
 * @openapi
 * /dashboard/charts:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Retrieve chart data for the dashboard
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponseSuccess'
 */
router.get(
  "/charts",
  authMiddleware,
  validationMiddleware(DashboardParamsDto, "query"),
  getDashboardCharts,
);

export default router;
