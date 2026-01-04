import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { CreateCreditCardDto } from "./dtos/credit-card-create.dto.js";
import { CreditCardParamsDto } from "./dtos/credit-card-params.dto.js";
import { CreditCardRouteParamsDto } from "./dtos/credit-card-route-params.dto.js";
import { UpdateCreditCardDto } from "./dtos/credit-card-update.dto.js";
import { CreateCreditCardExpenseDto } from "./dtos/credit-card-expense-create.dto.js";
import { CreditCardExpenseScopeQueryDto } from "./dtos/credit-card-scope-query.dto.js";
import { CreditCardExpenseParamsDto } from "./dtos/credit-card-expense-params.dto.js";
import { UpdateCreditCardExpenseDto } from "./dtos/credit-card-expense-update.dto.js";
import { CreditCardInvoiceQueryDto } from "./dtos/credit-card-invoice-query.dto.js";
import {
  createCreditCard,
  deleteCreditCard,
  getCreditCard,
  listCreditCards,
  updateCreditCard,
} from "./controllers/credit-card.controller.js";
import {
  createCreditCardExpense,
  getCreditCardInvoice,
  listCreditCardExpenses,
  removeCreditCardExpense,
  updateCreditCardExpense,
} from "./controllers/credit-card-expense.controller.js";

const router = Router();

/**
 * @openapi
 * /credit-cards:
 *   post:
 *     tags:
 *       - CreditCards
 *     summary: Cadastra um novo cartão de crédito para o usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, brand, lastFourDigits, creditLimit, closingDay, dueDay]
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               lastFourDigits:
 *                 type: string
 *                 minLength: 4
 *                 maxLength: 4
 *               creditLimit:
 *                 type: number
 *               closingDay:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *               dueDay:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *     responses:
 *       201:
 *         description: Cartão criado com sucesso
 *       400:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/",
  authMiddleware,
  validationMiddleware(CreateCreditCardDto),
  createCreditCard,
);

/**
 * @openapi
 * /credit-cards:
 *   get:
 *     tags:
 *       - CreditCards
 *     summary: Lista todos os cartões do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista recuperada com sucesso
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authMiddleware, listCreditCards);

/**
 * @openapi
 * /credit-cards/{id}:
 *   get:
 *     tags:
 *       - CreditCards
 *     summary: Recupera os dados de um cartão específico
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
 *         description: Cartão retornado
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:id",
  authMiddleware,
  validationMiddleware(CreditCardParamsDto, "params"),
  getCreditCard,
);

/**
 * @openapi
 * /credit-cards/{id}:
 *   put:
 *     tags:
 *       - CreditCards
 *     summary: Atualiza os dados de um cartão existente
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               lastFourDigits:
 *                 type: string
 *               creditLimit:
 *                 type: number
 *               closingDay:
 *                 type: integer
 *               dueDay:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cartão atualizado
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  "/:id",
  authMiddleware,
  validationMiddleware(CreditCardParamsDto, "params"),
  validationMiddleware(UpdateCreditCardDto),
  updateCreditCard,
);

/**
 * @openapi
 * /credit-cards/{id}:
 *   delete:
 *     tags:
 *       - CreditCards
 *     summary: Remove um cartão de crédito
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
 *         description: Cartão removido com sucesso
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  "/:id",
  authMiddleware,
  validationMiddleware(CreditCardParamsDto, "params"),
  deleteCreditCard,
);

/**
 * @openapi
 * /credit-cards/{id}/expenses:
 *   post:
 *     tags:
 *       - CreditCards
 *     summary: Registra uma despesa no cartão, criando parcelas quando necessário
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
 *             type: object
 *             required: [description, amount, purchaseDate]
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               purchaseDate:
 *                 type: string
 *                 format: date-time
 *               installments:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *     responses:
 *       201:
 *         description: Despesa registrada com sucesso
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/:id/expenses",
  authMiddleware,
  validationMiddleware(CreditCardParamsDto, "params"),
  validationMiddleware(CreateCreditCardExpenseDto),
  createCreditCardExpense,
);

/**
 * @openapi
 * /credit-cards/{id}/expenses:
 *   get:
 *     tags:
 *       - CreditCards
 *     summary: Lista todas as despesas de um cartão
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
 *         description: Despesas retornadas
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:id/expenses",
  authMiddleware,
  validationMiddleware(CreditCardParamsDto, "params"),
  listCreditCardExpenses,
);

/**
 * @openapi
 * /credit-cards/{cardId}/expenses/{expenseId}:
 *   put:
 *     tags:
 *       - CreditCards
 *     summary: Atualiza uma despesa ou todo o grupo de parcelas
 *     description: |
 *       Compras parceladas podem ser atualizadas individualmente (`scope=single`) ou em grupo (`scope=group`).
 *       A despesa só pode ser alterada se a fatura do mês correspondente ainda não estiver fechada (ou seja, a data atual é menor ou igual ao closingDay do cartão para o `invoiceMonth`).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: scope
 *         schema:
 *           type: string
 *           enum: [single, group]
 *           default: single
 *         description: Determina se apenas a parcela atual será alterada ou todas do grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Despesa atualizada
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Fatura fechada. Esta despesa não pode mais ser alterada.
 */
router.put(
  "/:cardId/expenses/:expenseId",
  authMiddleware,
  validationMiddleware(CreditCardRouteParamsDto, "params"),
  validationMiddleware(CreditCardExpenseParamsDto, "params"),
  validationMiddleware(CreditCardExpenseScopeQueryDto, "query"),
  validationMiddleware(UpdateCreditCardExpenseDto),
  updateCreditCardExpense,
);

/**
 * @openapi
 * /credit-cards/{cardId}/expenses/{expenseId}:
 *   delete:
 *     tags:
 *       - CreditCards
 *     summary: Remove uma despesa ou um grupo inteiro de parcelas
 *     description: A exclusão só é permitida enquanto a fatura não estiver fechada para o `invoiceMonth` das parcelas selecionadas.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: scope
 *         schema:
 *           type: string
 *           enum: [single, group]
 *           default: single
 *         description: "'group' remove todas as parcelas desde que nenhuma fatura esteja fechada."
 *     responses:
 *       204:
 *         description: Despesa removida
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Fatura fechada. Esta despesa não pode mais ser removida.
 */
router.delete(
  "/:cardId/expenses/:expenseId",
  authMiddleware,
  validationMiddleware(CreditCardRouteParamsDto, "params"),
  validationMiddleware(CreditCardExpenseParamsDto, "params"),
  validationMiddleware(CreditCardExpenseScopeQueryDto, "query"),
  removeCreditCardExpense,
);

/**
 * @openapi
 * /credit-cards/{id}/invoices:
 *   get:
 *     tags:
 *       - CreditCards
 *     summary: Recupera os lançamentos e o status da fatura para um mês específico
 *     description: |
 *       A fatura é considerada fechada quando a data atual ultrapassa o closingDay do cartão para o mês informado (YYYY-MM).
 *       Enquanto a fatura estiver aberta, as despesas permanecem editáveis e removíveis.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\\d{4}-\\d{2}$'
 *     responses:
 *       200:
 *         description: Fatura retornada com flag indicando se está fechada
 *       401:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  "/:id/invoices",
  authMiddleware,
  validationMiddleware(CreditCardParamsDto, "params"),
  validationMiddleware(CreditCardInvoiceQueryDto, "query"),
  getCreditCardInvoice,
);

export default router;
