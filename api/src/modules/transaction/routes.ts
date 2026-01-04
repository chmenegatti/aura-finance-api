import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { CreateTransactionDto } from "./dtos/transaction-create.dto.js";
import { TransactionListParamsDto } from "./dtos/transaction-list-params.dto.js";
import { TransactionParamsDto } from "./dtos/transaction-params.dto.js";
import { UpdateTransactionDto } from "./dtos/transaction-update.dto.js";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
} from "./controllers/transaction.controller.js";

const router = Router();

/**
 * @openapi
 * /transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: List transactions for the authenticated user
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
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
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
 *       - in: query
 *         name: isRecurring
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Paginated transactions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionListResponse'
 */
router.get("/", authMiddleware, validationMiddleware(TransactionListParamsDto, "query"), listTransactions);

/**
 * @openapi
 * /transactions:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a transaction for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionCreateRequest'
 *     responses:
 *       201:
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authMiddleware, validationMiddleware(CreateTransactionDto), createTransaction);

/**
 * @openapi
 * /transactions/{id}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Retrieve a transaction by id
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
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", authMiddleware, validationMiddleware(TransactionParamsDto, "params"), getTransaction);

/**
 * @openapi
 * /transactions/{id}:
 *   put:
 *     tags:
 *       - Transactions
 *     summary: Update a transaction
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
 *             $ref: '#/components/schemas/TransactionUpdateRequest'
 *     responses:
 *       200:
 *         description: Transaction updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(TransactionParamsDto, "params"),
  validationMiddleware(UpdateTransactionDto),
  updateTransaction,
);

/**
 * @openapi
 * /transactions/{id}:
 *   delete:
 *     tags:
 *       - Transactions
 *     summary: Remove a transaction
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
 *         description: Transaction deleted
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/:id",
  authMiddleware,
  validationMiddleware(TransactionParamsDto, "params"),
  deleteTransaction,
);

export default router;
