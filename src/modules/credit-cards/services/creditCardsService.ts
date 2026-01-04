import { api } from "@/services/api";
import type { ApiResponseSuccess } from "@/types/api";
import type {
  CreateCreditCardExpenseRequest,
  CreateCreditCardRequest,
  CreditCard,
  CreditCardDTO,
  CreditCardExpense,
  CreditCardExpenseDTO,
  CreditCardExpenseScope,
  CreditCardInvoice,
  CreditCardInvoiceDTO,
  UpdateCreditCardExpenseRequest,
} from "../types/credit-card";

const mapCreditCard = (dto: CreditCardDTO): CreditCard => ({
  id: dto.id,
  userId: dto.userId,
  name: dto.name,
  brand: dto.brand,
  lastFourDigits: dto.lastFourDigits,
  creditLimit: Number(dto.creditLimit),
  closingDay: dto.closingDay,
  dueDay: dto.dueDay,
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
});

const mapExpense = (dto: CreditCardExpenseDTO): CreditCardExpense => ({
  id: dto.id,
  creditCardId: dto.creditCardId,
  userId: dto.userId,
  groupId: dto.groupId,
  description: dto.description,
  amount: Number(dto.amount),
  purchaseDate: new Date(dto.purchaseDate),
  installments: dto.installments,
  currentInstallment: dto.currentInstallment,
  invoiceMonth: dto.invoiceMonth,
  createdAt: new Date(dto.createdAt),
});

const mapInvoice = (dto: CreditCardInvoiceDTO): CreditCardInvoice => ({
  invoiceMonth: dto.invoiceMonth,
  isClosed: dto.isClosed,
  closingDay: dto.closingDay,
  total: Number(dto.total),
  expenses: dto.expenses.map(mapExpense),
});

export const creditCardsService = {
  async list(): Promise<CreditCard[]> {
    const { data } = await api.get<ApiResponseSuccess<{ creditCards: CreditCardDTO[] }>>(
      "/credit-cards",
    );
    return data.data.creditCards.map(mapCreditCard);
  },

  async createCard(payload: CreateCreditCardRequest): Promise<CreditCard> {
    const { data } = await api.post<ApiResponseSuccess<{ creditCard: CreditCardDTO }>>(
      "/credit-cards",
      payload,
    );

    return mapCreditCard(data.data.creditCard);
  },

  async getById(cardId: string): Promise<CreditCard> {
    const { data } = await api.get<ApiResponseSuccess<{ creditCard: CreditCardDTO }>>(
      `/credit-cards/${cardId}`,
    );

    return mapCreditCard(data.data.creditCard);
  },

  async getInvoice(cardId: string, month: string): Promise<CreditCardInvoice> {
    const { data } = await api.get<ApiResponseSuccess<{ invoice: CreditCardInvoiceDTO }>>(
      `/credit-cards/${cardId}/invoices`,
      { params: { month } },
    );

    return mapInvoice(data.data.invoice);
  },

  async createExpense(cardId: string, payload: CreateCreditCardExpenseRequest): Promise<CreditCardExpense[]> {
    const { data } = await api.post<ApiResponseSuccess<{ expenses: CreditCardExpenseDTO[] }>>(
      `/credit-cards/${cardId}/expenses`,
      payload,
    );

    return data.data.expenses.map(mapExpense);
  },

  async updateExpense(
    cardId: string,
    expenseId: string,
    payload: UpdateCreditCardExpenseRequest,
    scope: CreditCardExpenseScope = "single",
  ): Promise<CreditCardExpense[]> {
    const { data } = await api.put<ApiResponseSuccess<{ expenses: CreditCardExpenseDTO[] }>>(
      `/credit-cards/${cardId}/expenses/${expenseId}`,
      payload,
      { params: { scope } },
    );

    return data.data.expenses.map(mapExpense);
  },

  async removeExpense(cardId: string, expenseId: string, scope: CreditCardExpenseScope = "single"): Promise<void> {
    await api.delete(`/credit-cards/${cardId}/expenses/${expenseId}`, { params: { scope } });
  },
};
