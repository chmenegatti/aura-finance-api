import { DeepPartial, Repository, SelectQueryBuilder } from "typeorm";

import { AppDataSource } from "../../../database/data-source.js";
import { Transaction, TransactionType } from "../entities/transaction.entity.js";

interface TransactionFilters {
  userId: string;
  type?: TransactionType;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  isRecurring?: boolean;
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
}

export class TransactionRepository {
  private get repository(): Repository<Transaction> {
    if (!AppDataSource.isInitialized) {
      throw new Error("Database connection is not ready");
    }

    return AppDataSource.getRepository(Transaction);
  }

  async findPaginated(filters: TransactionFilters, page: number, pageSize: number) {
    const query = this.repository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.category", "category")
      .where("transaction.userId = :userId", { userId: filters.userId })
      .orderBy("transaction.date", "DESC")
      .addOrderBy("transaction.createdAt", "DESC");

    if (filters.type) {
      query.andWhere("transaction.type = :type", { type: filters.type });
    }

    if (filters.categoryId) {
      query.andWhere("transaction.categoryId = :categoryId", { categoryId: filters.categoryId });
    }

    if (filters.isRecurring !== undefined) {
      query.andWhere("transaction.isRecurring = :isRecurring", { isRecurring: filters.isRecurring });
    }

    if (filters.startDate) {
      query.andWhere("transaction.date >= :startDate", { startDate: filters.startDate });
    }

    if (filters.endDate) {
      query.andWhere("transaction.date <= :endDate", { endDate: filters.endDate });
    }

    const [items, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total };
  }

  async getSummaryTotals(userId: string, startDate?: Date, endDate?: Date) {
    const query = this.repository
      .createQueryBuilder("transaction")
      .select("transaction.type", "type")
      .addSelect("SUM(transaction.amount)", "total")
      .where("transaction.userId = :userId", { userId });

    this.applyDateFilters(query, startDate, endDate);

    query.groupBy("transaction.type");

    return query.getRawMany<{ type: TransactionType; total: string }>();
  }

  async getMonthlyTotals(userId: string, startDate?: Date, endDate?: Date) {
    const query = this.repository
      .createQueryBuilder("transaction")
      .select("strftime('%Y-%m', transaction.date)", "month")
      .addSelect("transaction.type", "type")
      .addSelect("SUM(transaction.amount)", "total")
      .where("transaction.userId = :userId", { userId });

    this.applyDateFilters(query, startDate, endDate);

    query
      .groupBy("month")
      .addGroupBy("transaction.type")
      .orderBy("month", "ASC");

    return query.getRawMany<{ month: string; type: TransactionType; total: string }>();
  }

  async getExpensesByCategory(userId: string, startDate?: Date, endDate?: Date) {
    const query = this.repository
      .createQueryBuilder("transaction")
      .select("transaction.categoryId", "categoryId")
      .addSelect("category.name", "categoryName")
      .addSelect("SUM(transaction.amount)", "total")
      .innerJoin("transaction.category", "category")
      .where("transaction.userId = :userId", { userId })
      .andWhere("transaction.type = :expense", { expense: TransactionType.EXPENSE });

    this.applyDateFilters(query, startDate, endDate);

    query
      .groupBy("transaction.categoryId")
      .orderBy("total", "DESC");

    return query.getRawMany<{ categoryId: string; categoryName: string; total: string }>();
  }

  private applyDateFilters(query: SelectQueryBuilder<Transaction>, startDate?: Date, endDate?: Date) {
    if (startDate) {
      query.andWhere("transaction.date >= :startDate", { startDate });
    }

    if (endDate) {
      query.andWhere("transaction.date <= :endDate", { endDate });
    }
  }

  findById(id: string, userId: string) {
    return this.repository.findOne({ where: { id, userId }, relations: ["category"] });
  }

  async create(payload: DeepPartial<Omit<Transaction, "id" | "createdAt" | "updatedAt">>) {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  async update(transaction: Transaction) {
    return this.repository.save(transaction);
  }

  async delete(transaction: Transaction) {
    return this.repository.remove(transaction);
  }
}
