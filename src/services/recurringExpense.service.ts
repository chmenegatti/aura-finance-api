import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type {
  RecurringExpenseDTO,
  RecurringExpenseCreateRequest,
  RecurringExpenseUpdateRequest,
} from "@/types/recurringExpense";

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface RecurringExpenseListParams {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}

export const recurringExpenseService = {
  async listPaginated(params?: RecurringExpenseListParams): Promise<Paginated<RecurringExpenseDTO>> {
    const { data } = await api.get<ApiResponseSuccess<Paginated<RecurringExpenseDTO>>>(
      "/recurring-expenses",
      { params }
    );
    return data.data;
  },

  async list(): Promise<RecurringExpenseDTO[]> {
    const data = await this.listPaginated({ page: 1, pageSize: 100 });
    return data.items;
  },

  async getById(id: string): Promise<RecurringExpenseDTO> {
    const { data } = await api.get<ApiResponseSuccess<RecurringExpenseDTO>>(
      `/recurring-expenses/${id}`
    );
    return data.data;
  },

  async create(payload: RecurringExpenseCreateRequest): Promise<RecurringExpenseDTO> {
    const { data } = await api.post<ApiResponseSuccess<RecurringExpenseDTO>>(
      "/recurring-expenses",
      payload
    );
    return data.data;
  },

  async update(id: string, payload: RecurringExpenseUpdateRequest): Promise<RecurringExpenseDTO> {
    const { data } = await api.put<ApiResponseSuccess<RecurringExpenseDTO>>(
      `/recurring-expenses/${id}`,
      payload
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/recurring-expenses/${id}`);
  },

  async generate(payload: {
    startDate: string;
    endDate: string;
    defaultCategoryId: string;
    paymentMethod: string;
  }): Promise<{ count: number }> {
    const { data } = await api.post<ApiResponseSuccess<{ count: number }>>(
      "/recurring-expenses/generate",
      payload
    );
    return data.data;
  },
};
