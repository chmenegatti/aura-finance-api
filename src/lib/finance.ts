import { Transaction, FinancialSummary, Category } from "@/types/finance";

export const calculateSummary = (transactions: Transaction[]): FinancialSummary => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    balance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    savings: totalIncome - totalExpense,
  };
};

export const getExpensesByCategory = (transactions: Transaction[]) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  const categoryMap = new Map<string, { category: Category; total: number }>();

  expenses.forEach((transaction) => {
    const existing = categoryMap.get(transaction.category.id);
    if (existing) {
      existing.total += transaction.amount;
    } else {
      categoryMap.set(transaction.category.id, {
        category: transaction.category,
        total: transaction.amount,
      });
    }
  });

  return Array.from(categoryMap.values()).map((item) => ({
    name: item.category.name,
    value: item.total,
    color: item.category.color,
    icon: item.category.icon,
  }));
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(date);
};

export const formatFullDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};
