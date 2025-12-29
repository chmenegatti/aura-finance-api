export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: Category;
  date: Date;
  paymentMethod: string;
  notes?: string;
  attachments?: string[];
}

export interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  frequency: "monthly" | "yearly" | "weekly" | "custom";
  dueDay: number;
  totalInstallments?: number;
  currentInstallment?: number;
  isActive: boolean;
}

export interface FinancialSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
}
