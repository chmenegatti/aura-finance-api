import { RecurringExpenseRepository } from "../repositories/recurring-expense.repository.js";
import { CreateRecurringExpenseDto } from "../dtos/recurring-expense-create.dto.js";
import { UpdateRecurringExpenseDto } from "../dtos/recurring-expense-update.dto.js";
import { RecurringExpenseListParamsDto } from "../dtos/recurring-expense-list-params.dto.js";
import { NotFoundError } from "../errors/AppError.js";
import { RecurringExpense } from "../entities/recurring-expense.entity.js";

export class RecurringExpenseService {
  private repository = new RecurringExpenseRepository();

  async listPaginated(userId: string, params: RecurringExpenseListParamsDto) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const { items, total } = await this.repository.findPaginated(page, pageSize, userId);

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
    });

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

    return this.repository.update(recurringExpense);
  }

  async delete(userId: string, id: string) {
    const recurringExpense = await this.getById(userId, id);
    await this.repository.delete(recurringExpense);
  }
}
