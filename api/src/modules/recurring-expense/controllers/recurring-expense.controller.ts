import { instanceToPlain } from "class-transformer";
import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../types/authenticated-request.js";
import { RecurringExpenseService } from "../services/recurring-expense.service.js";
import { RecurringExpenseListParamsDto } from "../dtos/recurring-expense-list-params.dto.js";
import { CreateRecurringExpenseDto } from "../dtos/recurring-expense-create.dto.js";
import { UpdateRecurringExpenseDto } from "../dtos/recurring-expense-update.dto.js";
import { RecurringExpenseParamsDto } from "../dtos/recurring-expense-params.dto.js";

const recurringExpenseService = new RecurringExpenseService();

export const listRecurringExpenses = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pagination = await recurringExpenseService.listPaginated(
      req.user?.id ?? "",
      req.query as RecurringExpenseListParamsDto,
    );

    return res.status(200).json({
      status: "success",
      data: pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecurringExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as unknown as RecurringExpenseParamsDto;
    const recurringExpense = await recurringExpenseService.getById(req.user?.id ?? "", id);

    return res.status(200).json({
      status: "success",
      data: {
        recurringExpense: instanceToPlain(recurringExpense),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createRecurringExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const recurringExpense = await recurringExpenseService.create(
      req.user?.id ?? "",
      req.body as CreateRecurringExpenseDto,
    );

    return res.status(201).json({
      status: "success",
      data: {
        recurringExpense: instanceToPlain(recurringExpense),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateRecurringExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as unknown as RecurringExpenseParamsDto;
    const recurringExpense = await recurringExpenseService.update(
      req.user?.id ?? "",
      id,
      req.body as UpdateRecurringExpenseDto,
    );

    return res.status(200).json({
      status: "success",
      data: {
        recurringExpense: instanceToPlain(recurringExpense),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRecurringExpense = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as unknown as RecurringExpenseParamsDto;
    await recurringExpenseService.delete(req.user?.id ?? "", id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
