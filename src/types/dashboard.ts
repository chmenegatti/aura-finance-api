// Backend (OpenAPI)
export interface DashboardSummaryDTO {
  income: number;
  expense: number;
  balance: number;
}

export interface DashboardMonthlyPointDTO {
  month: string; // yyyy-MM
  income: number;
  expense: number;
}

export interface DashboardByCategoryPointDTO {
  categoryId: string;
  categoryName: string;
  total: number;
}

export interface DashboardChartsDTO {
  monthly: DashboardMonthlyPointDTO[];
  byCategory: DashboardByCategoryPointDTO[];
}

// UI helpers (formatos que os componentes já usam)
export interface PieSlice {
  name: string;
  value: number;
  color: string;
  iconName: string | null;
}

export interface IncomeExpensePoint {
  month: string;
  income: number;
  expense: number;
}

export interface BalancePoint {
  date: string;
  balance: number;
}
