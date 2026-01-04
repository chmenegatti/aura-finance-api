import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../types/authenticated-request.js";
import { CreditCardExpenseService } from "../services/credit-card-expense.service.js";
import { CreateCreditCardExpenseDto } from "../dtos/credit-card-expense-create.dto.js";
import { UpdateCreditCardExpenseDto } from "../dtos/credit-card-expense-update.dto.js";
import { CreditCardParamsDto } from "../dtos/credit-card-params.dto.js";
import { CreditCardRouteParamsDto } from "../dtos/credit-card-route-params.dto.js";
import { CreditCardExpenseParamsDto } from "../dtos/credit-card-expense-params.dto.js";
import { CreditCardExpenseScopeQueryDto } from "../dtos/credit-card-scope-query.dto.js";
import { CreditCardInvoiceQueryDto } from "../dtos/credit-card-invoice-query.dto.js";

const creditCardExpenseService = new CreditCardExpenseService();

export const createCreditCardExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.params as unknown as CreditCardParamsDto;
    const payload = req.body as CreateCreditCardExpenseDto;
    const userId = req.user?.id ?? "";
    const expenses = await creditCardExpenseService.create(userId, params.id, payload);

    return res.status(201).json({
      status: "success",
      data: {
        expenses,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const listCreditCardExpenses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.params as unknown as CreditCardParamsDto;
    const userId = req.user?.id ?? "";
    const expenses = await creditCardExpenseService.listByCard(userId, params.id);

    return res.status(200).json({
      status: "success",
      data: {
        expenses,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCreditCardExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.params as unknown as CreditCardRouteParamsDto & CreditCardExpenseParamsDto;
    const payload = req.body as UpdateCreditCardExpenseDto;
    const query = req.query as unknown as CreditCardExpenseScopeQueryDto;
    const scope = query.scope ?? "single";
    const userId = req.user?.id ?? "";
    const result = await creditCardExpenseService.update(userId, params.cardId, params.expenseId, payload, scope);
    const expenses = Array.isArray(result) ? result : [result];

    return res.status(200).json({
      status: "success",
      data: {
        expenses,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeCreditCardExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.params as unknown as CreditCardRouteParamsDto & CreditCardExpenseParamsDto;
    const query = req.query as unknown as CreditCardExpenseScopeQueryDto;
    const scope = query.scope ?? "single";
    const userId = req.user?.id ?? "";
    await creditCardExpenseService.remove(userId, params.cardId, params.expenseId, scope);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCreditCardInvoice = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const params = req.params as unknown as CreditCardParamsDto;
    const query = req.query as unknown as CreditCardInvoiceQueryDto;
    const userId = req.user?.id ?? "";
    const invoice = await creditCardExpenseService.getInvoice(userId, params.id, query.month);

    return res.status(200).json({
      status: "success",
      data: {
        invoice,
      },
    });
  } catch (error) {
    next(error);
  }
};
