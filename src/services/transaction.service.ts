import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type {
  Transaction,
  TransactionDTO,
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TransactionApiType,
} from "@/types/transaction";
import { mapTransaction, mapTransactions } from "./mappers";

export interface TransactionListParams {
  page?: number;
  pageSize?: number;
  startDate?: string; // ISO
  endDate?: string; // ISO
  type?: TransactionApiType;
  categoryId?: string;
  isRecurring?: boolean;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface TransactionListResponse {
  transactions: TransactionDTO[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface TransactionSingleResponse {
  transaction: TransactionDTO;
}

export const transactionService = {
  async listPaginated(params?: TransactionListParams): Promise<Paginated<Transaction>> {
    // Remove undefined values to avoid sending them as strings
    const cleanParams = params ? Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    ) : undefined;

    const { data } = await api.get<
      ApiResponseSuccess<TransactionListResponse>
    >("/transactions", { params: cleanParams });

    return {
      items: mapTransactions(data.data.transactions),
      page: data.data.page,
      pageSize: data.data.pageSize,
      total: data.data.total,
      totalPages: data.data.totalPages,
    };
  },

  async list(params?: TransactionListParams): Promise<Transaction[]> {
    const result = await this.listPaginated(params);
    return result.items;
  },

  async getById(id: string): Promise<Transaction> {
    const { data } = await api.get<ApiResponseSuccess<TransactionSingleResponse>>(
      `/transactions/${id}`
    );
    return mapTransaction(data.data.transaction);
  },

  async create(payload: TransactionCreateRequest): Promise<Transaction> {
    const { data } = await api.post<ApiResponseSuccess<TransactionSingleResponse>>(
      "/transactions",
      payload
    );
    return mapTransaction(data.data.transaction);
  },

  async update(id: string, payload: TransactionUpdateRequest): Promise<Transaction> {
    const { data } = await api.put<ApiResponseSuccess<TransactionSingleResponse>>(
      `/transactions/${id}`,
      payload
    );
    return mapTransaction(data.data.transaction);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
