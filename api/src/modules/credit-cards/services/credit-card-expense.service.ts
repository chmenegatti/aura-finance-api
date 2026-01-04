import { randomUUID } from "node:crypto";

import { ConflictError, NotFoundError } from "../../../errors/AppError.js";
import { CreditCard } from "../entities/credit-card.entity.js";
import { CreditCardExpense } from "../entities/credit-card-expense.entity.js";
import { CreditCardRepository } from "../repositories/credit-card.repository.js";
import { CreditCardExpenseRepository } from "../repositories/credit-card-expense.repository.js";
import { CreateCreditCardExpenseDto } from "../dtos/credit-card-expense-create.dto.js";
import { UpdateCreditCardExpenseDto } from "../dtos/credit-card-expense-update.dto.js";

type Scope = "single" | "group";

export class CreditCardExpenseService {
  private expenseRepository = new CreditCardExpenseRepository();
  private cardRepository = new CreditCardRepository();

  async create(userId: string, cardId: string, payload: CreateCreditCardExpenseDto) {
    const card = await this.ensureCardOwned(userId, cardId);
    const installments = payload.installments && payload.installments > 0 ? payload.installments : 1;
    const purchaseDate = new Date(payload.purchaseDate);
    const groupId = randomUUID();
    const baseInvoice = this.calculateInvoiceMonth(purchaseDate, card.closingDay);
    const expenses: Partial<CreditCardExpense>[] = [];

    for (let installment = 1; installment <= installments; installment += 1) {
      const invoiceMonth = this.formatInvoiceMonth(this.addMonths(baseInvoice, installment - 1));
      const amountValue = payload.amount.toFixed(2);

      expenses.push({
        creditCardId: card.id,
        userId,
        groupId,
        description: payload.description,
        amount: amountValue,
        purchaseDate,
        installments,
        currentInstallment: installment,
        invoiceMonth,
      });
    }

    return this.expenseRepository.createMany(expenses);
  }

  async listByCard(userId: string, cardId: string) {
    await this.ensureCardOwned(userId, cardId);
    return this.expenseRepository.findByCard(cardId, userId);
  }

  async update(userId: string, cardId: string, expenseId: string, payload: UpdateCreditCardExpenseDto, scope: Scope = "single") {
    const card = await this.ensureCardOwned(userId, cardId);
    const expense = await this.expenseRepository.findById(expenseId, userId, cardId);

    if (!expense) {
      throw new NotFoundError("Despesa não encontrada");
    }

    if (scope === "single") {
      this.ensureInvoiceOpen(card, expense.invoiceMonth);
      this.applyExpenseUpdates(expense, payload);
      return this.expenseRepository.update(expense);
    }

    const group = await this.expenseRepository.findByGroup(cardId, userId, expense.groupId);

    if (!group.length) {
      throw new NotFoundError("Grupo de parcelas não encontrado");
    }

    for (const parcel of group) {
      this.ensureInvoiceOpen(card, parcel.invoiceMonth);
    }

    const updates = group.map((parcel) => {
      this.applyExpenseUpdates(parcel, payload);
      return parcel;
    });

    return this.expenseRepository.saveMany(updates);
  }

  async remove(userId: string, cardId: string, expenseId: string, scope: Scope = "single") {
    const card = await this.ensureCardOwned(userId, cardId);
    const expense = await this.expenseRepository.findById(expenseId, userId, cardId);

    if (!expense) {
      throw new NotFoundError("Despesa não encontrada");
    }

    if (scope === "single") {
      this.ensureInvoiceOpen(card, expense.invoiceMonth);
      return this.expenseRepository.remove(expense);
    }

    const group = await this.expenseRepository.findByGroup(cardId, userId, expense.groupId);

    if (!group.length) {
      throw new NotFoundError("Grupo de parcelas não encontrado");
    }

    for (const parcel of group) {
      this.ensureInvoiceOpen(card, parcel.invoiceMonth);
    }

    return this.expenseRepository.removeMany(group);
  }

  async getInvoice(userId: string, cardId: string, month: string) {
    const card = await this.ensureCardOwned(userId, cardId);
    const expenses = await this.expenseRepository.findByInvoiceMonth(cardId, userId, month);
    const isClosed = this.isInvoiceClosed(card, month);
    const total = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);

    return {
      invoiceMonth: month,
      isClosed,
      closingDay: card.closingDay,
      expenses,
      total: total.toFixed(2),
    };
  }

  private ensureCardOwned(userId: string, cardId: string) {
    return this.cardRepository.findById(cardId, userId).then((card) => {
      if (!card) {
        throw new NotFoundError("Cartão não encontrado");
      }

      return card;
    });
  }

  private applyExpenseUpdates(expense: CreditCardExpense, payload: UpdateCreditCardExpenseDto) {
    if (payload.description !== undefined) {
      expense.description = payload.description;
    }

    if (payload.amount !== undefined) {
      expense.amount = payload.amount.toFixed(2);
    }
  }

  private addMonths(date: Date, months: number) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  private calculateInvoiceMonth(date: Date, closingDay: number) {
    const candidate = new Date(date);
    const day = candidate.getDate();

    if (day > closingDay) {
      candidate.setMonth(candidate.getMonth() + 1);
    }

    return new Date(candidate.getFullYear(), candidate.getMonth(), 1);
  }

  private formatInvoiceMonth(date: Date) {
    const month = date.getMonth() + 1;
    return `${date.getFullYear()}-${month.toString().padStart(2, "0")}`;
  }

  private isInvoiceClosed(card: CreditCard, invoiceMonth: string) {
    const closingDate = this.buildClosingDate(card, invoiceMonth);
    return new Date() > closingDate;
  }

  private ensureInvoiceOpen(card: CreditCard, invoiceMonth: string) {
    if (this.isInvoiceClosed(card, invoiceMonth)) {
      throw new ConflictError("Fatura fechada. Esta despesa não pode mais ser alterada.");
    }
  }

  private buildClosingDate(card: CreditCard, invoiceMonth: string) {
    const [year, month] = invoiceMonth.split("-").map(Number);
    const maxDay = new Date(year, month, 0).getDate();
    const closingDay = Math.min(card.closingDay, maxDay);

    const closingDate = new Date(year, month - 1, closingDay);
    closingDate.setHours(23, 59, 59, 999);

    return closingDate;
  }
}
