import { instanceToPlain } from "class-transformer";
import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../types/authenticated-request.js";
import { TransactionService } from "../services/transaction.service.js";
import { CreateTransactionDto } from "../dtos/transaction-create.dto.js";
import { TransactionListParamsDto } from "../dtos/transaction-list-params.dto.js";
import { UpdateTransactionDto } from "../dtos/transaction-update.dto.js";
import { TransactionParamsDto } from "../dtos/transaction-params.dto.js";

const transactionService = new TransactionService();

export const listTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pagination = await transactionService.listPaginated(
      req.user?.id ?? "",
      req.query as TransactionListParamsDto,
    );

    return res.status(200).json({
      status: "success",
      data: {
        transactions: pagination.items.map((transaction) => instanceToPlain(transaction)),
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        totalPages: pagination.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as unknown as TransactionParamsDto;
    const transaction = await transactionService.getById(req.user?.id ?? "", id);

    return res.status(200).json({
      status: "success",
      data: {
        transaction: instanceToPlain(transaction),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const transaction = await transactionService.create(
      req.user?.id ?? "",
      req.body as CreateTransactionDto,
    );

    return res.status(201).json({
      status: "success",
      data: {
        transaction: instanceToPlain(transaction),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as unknown as TransactionParamsDto;
    const transaction = await transactionService.update(
      req.user?.id ?? "",
      id,
      req.body as UpdateTransactionDto,
    );

    return res.status(200).json({
      status: "success",
      data: {
        transaction: instanceToPlain(transaction),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as unknown as TransactionParamsDto;
    await transactionService.delete(req.user?.id ?? "", id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
