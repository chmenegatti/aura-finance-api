import { motion } from "framer-motion";
import { Plus, Bell } from "lucide-react";
import { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExpensesPieChart } from "@/components/dashboard/ExpensesPieChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { RecurringExpensesCard } from "@/components/dashboard/RecurringExpensesCard";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { DateRangeFilter, DateRange } from "@/components/filters/DateRangeFilter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryService, dashboardService, recurringExpenseService, transactionService } from "@/services";
import type { FinancialSummary } from "@/types/finance";
import type { PieSlice, IncomeExpensePoint, BalancePoint } from "@/types/dashboard";
import type { RecurringExpense, RecurringExpenseDTO } from "@/types/recurringExpense";

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function formatMonthLabel(month: string): string {
  const parts = month.split("-");
  const mm = Number(parts[1]);
  if (!Number.isFinite(mm) || mm < 1 || mm > 12) return month;
  return MONTH_LABELS[mm - 1] ?? month;
}

function mapRecurringToUi(dto: RecurringExpenseDTO): RecurringExpense {
  const startDate = new Date(dto.startDate);
  const endDate = dto.endDate ? new Date(dto.endDate) : null;
  const now = new Date();

  const isActive = endDate ? endDate.getTime() >= now.getTime() : true;
  const dueDay = Number.isFinite(startDate.getDate()) ? startDate.getDate() : 1;

  const frequency = dto.frequency === "MONTHLY" ? "monthly" : dto.frequency === "YEARLY" ? "yearly" : "custom";

  const iconByType: Record<RecurringExpenseDTO["type"], string> = {
    FINANCING: "🚗",
    LOAN: "🏦",
    SUBSCRIPTION: "🔁",
    OTHER: "📌",
  };

  return {
    id: dto.id,
    description: dto.description,
    amount: Number(dto.amount),
    frequency,
    dueDay,
    totalInstallments: dto.totalInstallments,
    currentInstallment: dto.currentInstallment,
    isActive,
    category: {
      id: dto.type,
      name: dto.type,
      icon: iconByType[dto.type] ?? "🏷️",
      color: "hsl(var(--muted-foreground))",
    },
  };
}

const Dashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const summaryQuery = useQuery({
    queryKey: ["dashboard", "summary", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: () => dashboardService.getSummary(),
  });

  const chartsQuery = useQuery({
    queryKey: ["dashboard", "charts", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: () => dashboardService.getCharts(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.list(),
  });

  const transactionsQuery = useQuery({
    queryKey: ["transactions", { page: 1, pageSize: 50, startDate: dateRange.from.toISOString(), endDate: dateRange.to.toISOString() }],
    queryFn: () => transactionService.listPaginated({ page: 1, pageSize: 50 }),
  });

  const recurringQuery = useQuery({
    queryKey: ["recurring-expenses", { page: 1, pageSize: 50 }],
    queryFn: () => recurringExpenseService.listPaginated({ page: 1, pageSize: 50 }),
  });

  const summary: FinancialSummary | null = summaryQuery.data
    ? {
      balance: summaryQuery.data.balance,
      totalIncome: summaryQuery.data.income,
      totalExpense: summaryQuery.data.expense,
      savings: summaryQuery.data.balance,
    }
    : null;

  const incomeExpenseByMonth: IncomeExpensePoint[] =
    chartsQuery.data?.monthly.map((p) => ({
      month: formatMonthLabel(p.month),
      income: p.income,
      expense: p.expense,
    })) ?? [];

  const balanceHistory: BalancePoint[] = (() => {
    const monthly = chartsQuery.data?.monthly ?? [];
    const sorted = [...monthly].sort((a, b) => a.month.localeCompare(b.month));
    let running = 0;
    return sorted.map((p) => {
      running += p.income - p.expense;
      return { date: formatMonthLabel(p.month), balance: running };
    });
  })();

  const expensesByCategory: PieSlice[] = (() => {
    const byCategory = chartsQuery.data?.byCategory ?? [];
    const categories = categoriesQuery.data ?? [];
    const categoriesById = new Map(categories.map((c) => [c.id, c] as const));
    return byCategory.map((p) => {
      const cat = categoriesById.get(p.categoryId);
      return {
        name: p.categoryName,
        value: p.total,
        color: cat?.color ?? "hsl(var(--muted-foreground))",
        icon: cat?.icon ?? "🏷️",
      };
    });
  })();

  // Filter transactions by date range
  const transactions =
    transactionsQuery.data?.items
      .filter((t) => {
        const transactionDate = t.date;
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      })
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime()) ?? [];

  const recurringExpenses =
    recurringQuery.data?.items.map(mapRecurringToUi) ?? [];

  return (
    <MainLayout>
      <TransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => {
          summaryQuery.refetch();
          chartsQuery.refetch();
          transactionsQuery.refetch();
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Olá, bem-vindo! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está o resumo das suas finanças
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>
          <Button variant="income" size="lg" className="gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nova Transação</span>
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      {summary ? (
        <SummaryCards summary={summary} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ExpensesPieChart data={expensesByCategory} />
        <IncomeExpenseChart data={incomeExpenseByMonth} />
      </div>

      {/* Balance Chart */}
      <div className="mt-6">
        <BalanceChart data={balanceHistory} />
      </div>

      {/* Transactions and Recurring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TransactionList transactions={transactions} limit={5} />
        <RecurringExpensesCard expenses={recurringExpenses} limit={5} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;