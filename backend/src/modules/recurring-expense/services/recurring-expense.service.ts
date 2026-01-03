import { RecurringFrequency, RecurringExpense } from "../entities/recurring-expense.entity.js";
import { TransactionType } from "../../transaction/entities/transaction.entity.js";
import { TransactionRepository } from "../../transaction/repositories/transaction.repository.js";
import {
  RecurringExpenseFilter,
  RecurringExpenseRepository,
} from "../repositories/recurring-expense.repository.js";
import { CreateRecurringExpenseDto } from "../dtos/recurring-expense-create.dto.js";
import { UpdateRecurringExpenseDto } from "../dtos/recurring-expense-update.dto.js";
import { RecurringExpenseListParamsDto } from "../dtos/recurring-expense-list-params.dto.js";
import { NotFoundError } from "../../../errors/AppError.js";

export class RecurringExpenseService {
  private repository = new RecurringExpenseRepository();
  private transactionRepository = new TransactionRepository();

  async listPaginated(userId: string, params: RecurringExpenseListParamsDto) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const filter: RecurringExpenseFilter = {};

    if (params.startDate) {
      filter.startDate = new Date(params.startDate);
    }

    if (params.endDate) {
      filter.endDate = new Date(params.endDate);
    }

    const { items, total } = await this.repository.findPaginated(
      page,
      pageSize,
      userId,
      filter,
    );

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      items,
      page,
      pageSize,
      total,
      totalPages,
    };
  }

  async getById(userId: string, id: string) {
    const recurringExpense = await this.repository.findById(id, userId);

    if (!recurringExpense) {
      throw new NotFoundError("Recurring expense not found");
    }

    return recurringExpense;
  }

  async create(userId: string, payload: CreateRecurringExpenseDto) {
    const entity = await this.repository.create({
      description: payload.description,
      amount: payload.amount.toFixed(2),
      startDate: new Date(payload.startDate),
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
      frequency: payload.frequency,
      customIntervalDays: payload.customIntervalDays,
      totalInstallments: payload.totalInstallments,
      currentInstallment: payload.currentInstallment ?? 0,
      type: payload.type,
      userId,
      categoryId: payload.categoryId,
    });

    await this.createTransactionsFromRecurring(userId, entity);

    return entity;
  }

  async update(userId: string, id: string, payload: UpdateRecurringExpenseDto) {
    const recurringExpense = await this.getById(userId, id);

    if (payload.description !== undefined) {
      recurringExpense.description = payload.description;
    }

    if (payload.amount !== undefined) {
      recurringExpense.amount = payload.amount.toFixed(2);
    }

    if (payload.startDate) {
      recurringExpense.startDate = new Date(payload.startDate);
    }

    if (payload.endDate !== undefined) {
      recurringExpense.endDate = payload.endDate ? new Date(payload.endDate) : undefined;
    }

    if (payload.frequency) {
      recurringExpense.frequency = payload.frequency;
    }

    if (payload.customIntervalDays !== undefined) {
      recurringExpense.customIntervalDays = payload.customIntervalDays ?? undefined;
    }

    if (payload.totalInstallments !== undefined) {
      recurringExpense.totalInstallments = payload.totalInstallments;
    }

    if (payload.currentInstallment !== undefined) {
      recurringExpense.currentInstallment = payload.currentInstallment;
    }

    if (payload.type) {
      recurringExpense.type = payload.type;
    }

    if (payload.categoryId !== undefined) {
      recurringExpense.categoryId = payload.categoryId;
    }

    return this.repository.update(recurringExpense);
  }

  async delete(userId: string, id: string) {
    const recurringExpense = await this.getById(userId, id);
    await this.repository.delete(recurringExpense);
  }

  private async createTransactionsFromRecurring(userId: string, recurringExpense: RecurringExpense) {
    const occurrences = this.buildRecurringOccurrences(recurringExpense);

    if (occurrences.length === 0 || !recurringExpense.categoryId) {
      return;
    }

    for (const date of occurrences) {
      await this.transactionRepository.create({
        description: recurringExpense.description,
        amount: recurringExpense.amount,
        type: TransactionType.EXPENSE,
        date,
        paymentMethod: "Recorrente",
        isRecurring: true,
        categoryId: recurringExpense.categoryId,
        userId,
      });
    }
  }

  private buildRecurringOccurrences(recurringExpense: RecurringExpense): Date[] {
    if (!recurringExpense.totalInstallments || recurringExpense.totalInstallments <= 0) {
      return [];
    }

    const occurrences: Date[] = [];
    let nextDate = new Date(recurringExpense.startDate);
    const endDate = recurringExpense.endDate ? new Date(recurringExpense.endDate) : null;
    let created = 0;

    while (created < recurringExpense.totalInstallments) {
      if (endDate && nextDate > endDate) {
        break;
      }

      occurrences.push(new Date(nextDate));
      created += 1;

      const advanced = this.advanceRecurringDate(
        nextDate,
        recurringExpense.frequency,
        recurringExpense.customIntervalDays,
      );

      if (advanced.getTime() === nextDate.getTime()) {
        break;
      }

      nextDate = advanced;
    }

    return occurrences;
  }

  private advanceRecurringDate(date: Date, frequency: RecurringFrequency, customIntervalDays?: number) {
    const next = new Date(date);

    if (frequency === RecurringFrequency.YEARLY) {
      next.setFullYear(next.getFullYear() + 1);
      return next;
    }

    if (frequency === RecurringFrequency.CUSTOM && customIntervalDays && customIntervalDays > 0) {
      next.setDate(next.getDate() + customIntervalDays);
      return next;
    }

    next.setMonth(next.getMonth() + 1);
    return next;
  }
}
