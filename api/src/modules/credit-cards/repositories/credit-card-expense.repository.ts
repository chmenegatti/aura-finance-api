import { Repository } from "typeorm";

import { AppDataSource } from "../../../database/data-source.js";
import { CreditCardExpense } from "../entities/credit-card-expense.entity.js";

export class CreditCardExpenseRepository {
  private get repository(): Repository<CreditCardExpense> {
    if (!AppDataSource.isInitialized) {
      throw new Error("Database connection is not ready");
    }

    return AppDataSource.getRepository(CreditCardExpense);
  }

  findById(id: string, userId: string, cardId?: string) {
    const where = { id, userId, ...(cardId ? { creditCardId: cardId } : {}) };
    return this.repository.findOne({ where });
  }

  findByCard(cardId: string, userId: string) {
    return this.repository.find({ where: { creditCardId: cardId, userId }, order: { purchaseDate: "DESC" } });
  }

  findByInvoiceMonth(cardId: string, userId: string, invoiceMonth: string) {
    return this.repository.find({
      where: { creditCardId: cardId, userId, invoiceMonth },
      order: { currentInstallment: "ASC" },
    });
  }

  findByGroup(cardId: string, userId: string, groupId: string) {
    return this.repository.find({ where: { creditCardId: cardId, userId, groupId }, order: { currentInstallment: "ASC" } });
  }

  async create(expense: Partial<CreditCardExpense>) {
    const entity = this.repository.create(expense);
    return this.repository.save(entity);
  }

  async createMany(expenses: Partial<CreditCardExpense>[]) {
    const entities = this.repository.create(expenses);
    return this.repository.save(entities);
  }

  async update(expense: CreditCardExpense) {
    return this.repository.save(expense);
  }

  async saveMany(expenses: CreditCardExpense[]) {
    return this.repository.save(expenses);
  }

  async remove(expense: CreditCardExpense) {
    return this.repository.remove(expense);
  }

  async removeMany(expenses: CreditCardExpense[]) {
    return this.repository.remove(expenses);
  }
}
