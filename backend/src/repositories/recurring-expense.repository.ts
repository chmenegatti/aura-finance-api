import { Repository } from "typeorm";

import { AppDataSource } from "../database/data-source.js";
import { RecurringExpense } from "../entities/recurring-expense.entity.js";

export interface RecurringExpensePaginationResult {
  items: RecurringExpense[];
  total: number;
}

export class RecurringExpenseRepository {
  private get repository(): Repository<RecurringExpense> {
    if (!AppDataSource.isInitialized) {
      throw new Error("Database connection is not ready");
    }

    return AppDataSource.getRepository(RecurringExpense);
  }

  async findPaginated(page: number, pageSize: number, userId: string) {
    const [items, total] = await this.repository
      .createQueryBuilder("recurringExpense")
      .where("recurringExpense.userId = :userId", { userId })
      .orderBy("recurringExpense.createdAt", "DESC")
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total };
  }

  findById(id: string, userId: string) {
    return this.repository.findOne({ where: { id, userId } });
  }

  async create(payload: Partial<RecurringExpense>) {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  async update(recurringExpense: RecurringExpense) {
    return this.repository.save(recurringExpense);
  }

  async delete(recurringExpense: RecurringExpense) {
    return this.repository.remove(recurringExpense);
  }
}
