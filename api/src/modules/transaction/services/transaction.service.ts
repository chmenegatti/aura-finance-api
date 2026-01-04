import { NotFoundError } from "../../../errors/AppError.js";
import { Transaction } from "../entities/transaction.entity.js";
import { TransactionRepository } from "../repositories/transaction.repository.js";
import { CreateTransactionDto } from "../dtos/transaction-create.dto.js";
import { TransactionListParamsDto } from "../dtos/transaction-list-params.dto.js";
import { UpdateTransactionDto } from "../dtos/transaction-update.dto.js";

export class TransactionService {
  private transactionRepository = new TransactionRepository();

  async listPaginated(userId: string, params: TransactionListParamsDto) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const filters = {
      userId,
      type: params.type,
      categoryId: params.categoryId,
      isRecurring: params.isRecurring,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
    };

    const { items, total } = await this.transactionRepository.findPaginated(filters, page, pageSize);

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
    const transaction = await this.transactionRepository.findById(id, userId);

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    return transaction;
  }

  async create(userId: string, payload: CreateTransactionDto) {
    const entity = await this.transactionRepository.create({
      description: payload.description,
      amount: payload.amount.toFixed(2),
      type: payload.type,
      categoryId: payload.categoryId,
      paymentMethod: payload.paymentMethod,
      date: new Date(payload.date),
      isRecurring: payload.isRecurring ?? false,
      notes: payload.notes,
      receiptUrl: payload.receiptUrl,
      userId,
    });

    return this.getById(userId, entity.id);
  }

  async update(userId: string, id: string, payload: UpdateTransactionDto) {
    const transaction = await this.getById(userId, id);

    if (payload.description !== undefined) {
      transaction.description = payload.description;
    }

    if (payload.amount !== undefined) {
      transaction.amount = payload.amount.toFixed(2);
    }

    if (payload.type) {
      transaction.type = payload.type;
    }

    if (payload.categoryId) {
      transaction.categoryId = payload.categoryId;
    }

    if (payload.paymentMethod) {
      transaction.paymentMethod = payload.paymentMethod;
    }

    if (payload.date) {
      transaction.date = new Date(payload.date);
    }

    if (payload.isRecurring !== undefined) {
      transaction.isRecurring = payload.isRecurring;
    }

    if (payload.notes !== undefined) {
      transaction.notes = payload.notes;
    }

    if (payload.receiptUrl !== undefined) {
      transaction.receiptUrl = payload.receiptUrl;
    }

    return this.transactionRepository.update(transaction);
  }

  async delete(userId: string, id: string) {
    const transaction = await this.getById(userId, id);
    await this.transactionRepository.delete(transaction);
  }
}
