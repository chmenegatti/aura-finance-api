export type CreditCardExpenseScope = "single" | "group";

export interface CreditCardDTO {
  id: string;
  userId: string;
  name: string;
  brand: string;
  lastFourDigits: string;
  creditLimit: string;
  closingDay: number;
  dueDay: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreditCard {
  id: string;
  userId: string;
  name: string;
  brand: string;
  lastFourDigits: string;
  creditLimit: number;
  closingDay: number;
  dueDay: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditCardExpenseDTO {
  id: string;
  creditCardId: string;
  userId: string;
  groupId: string;
  description: string;
  amount: string;
  purchaseDate: string;
  installments: number;
  currentInstallment: number;
  invoiceMonth: string;
  createdAt: string;
}

export interface CreditCardExpense {
  id: string;
  creditCardId: string;
  userId: string;
  groupId: string;
  description: string;
  amount: number;
  purchaseDate: Date;
  installments: number;
  currentInstallment: number;
  invoiceMonth: string;
  createdAt: Date;
}

export interface CreditCardInvoiceDTO {
  invoiceMonth: string;
  isClosed: boolean;
  closingDay: number;
  expenses: CreditCardExpenseDTO[];
  total: string;
}

export interface CreditCardInvoice {
  invoiceMonth: string;
  isClosed: boolean;
  closingDay: number;
  expenses: CreditCardExpense[];
  total: number;
}

export interface CreateCreditCardRequest {
  name: string;
  brand: string;
  lastFourDigits: string;
  creditLimit: number;
  closingDay: number;
  dueDay: number;
}

export interface CreateCreditCardExpenseRequest {
  description: string;
  amount: number;
  purchaseDate: string;
  installments?: number;
}

export interface UpdateCreditCardExpenseRequest {
  description?: string;
  amount?: number;
}
