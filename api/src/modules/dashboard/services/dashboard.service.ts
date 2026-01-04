import { TransactionType } from "../../transaction/entities/transaction.entity.js";
import { TransactionRepository } from "../../transaction/repositories/transaction.repository.js";
import { DashboardParamsDto } from "../dtos/dashboard-params.dto.js";

interface DashboardSummaryResult {
  income: number;
  expense: number;
  balance: number;
}

interface DashboardMonthlyPoint {
  month: string;
  income: number;
  expense: number;
}

interface DashboardByCategoryPoint {
  categoryId: string;
  categoryName: string;
  total: number;
}

interface DashboardChartsResult {
  monthly: DashboardMonthlyPoint[];
  byCategory: DashboardByCategoryPoint[];
}

export class DashboardService {
  private transactionRepository = new TransactionRepository();

  async getSummary(userId: string, params?: DashboardParamsDto): Promise<DashboardSummaryResult> {
    const { startDate, endDate } = this.buildDateRange(params);
    const totals = await this.transactionRepository.getSummaryTotals(userId, startDate, endDate);

    const income = Number(totals.find((row) => row.type === TransactionType.INCOME)?.total ?? 0);
    const expense = Number(totals.find((row) => row.type === TransactionType.EXPENSE)?.total ?? 0);
    const balance = Number((income - expense).toFixed(2));

    return { income, expense, balance };
  }

  async getCharts(userId: string, params?: DashboardParamsDto): Promise<DashboardChartsResult> {
    const { startDate, endDate } = this.buildDateRange(params);
    const monthlyTotals = await this.transactionRepository.getMonthlyTotals(userId, startDate, endDate);
    const byCategoryTotals = await this.transactionRepository.getExpensesByCategory(userId, startDate, endDate);

    const monthlyMap = new Map<string, DashboardMonthlyPoint>();

    for (const row of monthlyTotals) {
      const month = row.month;
      const total = Number(row.total ?? 0);
      let entry = monthlyMap.get(month);

      if (!entry) {
        entry = { month, income: 0, expense: 0 };
        monthlyMap.set(month, entry);
      }

      if (row.type === TransactionType.INCOME) {
        entry.income += total;
      } else {
        entry.expense += total;
      }
    }

    const monthly = Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((point) => ({
        month: point.month,
        income: Number(point.income.toFixed(2)),
        expense: Number(point.expense.toFixed(2)),
      }));

    const byCategory = byCategoryTotals.map((row) => ({
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      total: Number(row.total ?? 0),
    }));

    return { monthly, byCategory };
  }

  private buildDateRange(params?: DashboardParamsDto) {
    return {
      startDate: params?.startDate ? new Date(params.startDate) : undefined,
      endDate: params?.endDate ? new Date(params.endDate) : undefined,
    };
  }
}
