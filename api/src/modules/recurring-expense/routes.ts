import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { CreateRecurringExpenseDto } from "./dtos/recurring-expense-create.dto.js";
import { RecurringExpenseListParamsDto } from "./dtos/recurring-expense-list-params.dto.js";
import { RecurringExpenseParamsDto } from "./dtos/recurring-expense-params.dto.js";
import { UpdateRecurringExpenseDto } from "./dtos/recurring-expense-update.dto.js";
import {
  createRecurringExpense,
  deleteRecurringExpense,
  getRecurringExpense,
  listRecurringExpenses,
  updateRecurringExpense,
} from "./controllers/recurring-expense.controller.js";

const router = Router();

/**
 * @openapi
 * /recurring-expenses:
 *   get:
 *     tags:
 *       - RecurringExpenses
 *     summary: List recurring expenses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Paginated recurring expenses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringExpenseListResponse'
 */
router.get(
  "/",
  authMiddleware,
  validationMiddleware(RecurringExpenseListParamsDto, "query"),
  listRecurringExpenses,
);

/**
 * @openapi
 * /recurring-expenses:
 *   post:
 *     tags:
 *       - RecurringExpenses
 *     summary: Create a recurring expense
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecurringExpenseCreateRequest'
 *     responses:
 *       201:
 *         description: Recurring expense created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringExpenseResponse'
 */
router.post(
  "/",
  authMiddleware,
  validationMiddleware(CreateRecurringExpenseDto),
  createRecurringExpense,
);

/**
 * @openapi
 * /recurring-expenses/{id}:
 *   get:
 *     tags:
 *       - RecurringExpenses
 *     summary: Get a recurring expense by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Recurring expense details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringExpenseResponse'
 */
router.get(
  "/:id",
  authMiddleware,
  validationMiddleware(RecurringExpenseParamsDto, "params"),
  getRecurringExpense,
);

/**
 * @openapi
 * /recurring-expenses/{id}:
 *   put:
 *     tags:
 *       - RecurringExpenses
 *     summary: Update a recurring expense
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecurringExpenseUpdateRequest'
 *     responses:
 *       200:
 *         description: Recurring expense updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringExpenseResponse'
 */
router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(RecurringExpenseParamsDto, "params"),
  validationMiddleware(UpdateRecurringExpenseDto),
  updateRecurringExpense,
);

/**
 * @openapi
 * /recurring-expenses/{id}:
 *   delete:
 *     tags:
 *       - RecurringExpenses
 *     summary: Remove a recurring expense
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Recurring expense deleted
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/:id",
  authMiddleware,
  validationMiddleware(RecurringExpenseParamsDto, "params"),
  deleteRecurringExpense,
);

export default router;
