import { useState } from "react";
import { motion } from "framer-motion";
import { addDays, addMonths, addYears, endOfDay, endOfMonth, startOfMonth } from "date-fns";
import {
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Pencil,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatFullDate } from "@/lib/finance";
import { recurringExpenseService, transactionService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DateRangeFilter, DateRange } from "@/components/filters/DateRangeFilter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { ApiError } from "@/types/api";
import type { Transaction } from "@/types/transaction";
import type { RecurringExpenseDTO } from "@/types/recurringExpense";
import type { CategoryType } from "@/types/category";

function advanceRecurringDate(
  date: Date,
  frequency: RecurringExpenseDTO["frequency"],
  customIntervalDays: number | null,
) {
  if (frequency === "YEARLY") {
    return addYears(date, 1);
  }

  if (frequency === "CUSTOM" && customIntervalDays && customIntervalDays > 0) {
    return addDays(date, customIntervalDays);
  }

  return addMonths(date, 1);
}

function getRecurringOccurrencesInRange(recurring: RecurringExpenseDTO, range: DateRange): Date[] {
  const startDate = new Date(recurring.startDate);
  const endDate = recurring.endDate ? new Date(recurring.endDate) : null;

  if (recurring.totalInstallments > 0 && recurring.currentInstallment >= recurring.totalInstallments) {
    return [];
  }

  const occurrences: Date[] = [];
  let occurrenceDate = startDate;
  let occurrenceIndex = 0;

  while (true) {
    if (occurrenceDate > range.to) {
      break;
    }

    if (endDate && occurrenceDate > endDate) {
      break;
    }

    if (recurring.totalInstallments > 0 && occurrenceIndex >= recurring.totalInstallments) {
      break;
    }

    const isAfterCurrentInstallment = occurrenceIndex >= recurring.currentInstallment;

    if (
      isAfterCurrentInstallment &&
      occurrenceDate >= range.from &&
      occurrenceDate <= range.to
    ) {
      occurrences.push(new Date(occurrenceDate));
    }

    const nextDate = advanceRecurringDate(
      occurrenceDate,
      recurring.frequency,
      recurring.customIntervalDays,
    );

    if (nextDate.getTime() === occurrenceDate.getTime()) {
      break;
    }

    occurrenceDate = nextDate;
    occurrenceIndex += 1;
  }

  return occurrences;
}

function buildRecurringTransactions(expenses: RecurringExpenseDTO[], range: DateRange): Transaction[] {
  return expenses.flatMap((expense) => {
    const occurrences = getRecurringOccurrencesInRange(expense, range);

    if (occurrences.length === 0) {
      return [];
    }

    const category = expense.category
      ? {
        id: expense.category.id,
        name: expense.category.name,
        icon: expense.category.icon ?? "🏷️",
        color: expense.category.color ?? "hsl(var(--muted-foreground))",
        type: expense.category.type as CategoryType,
        userId: expense.category.userId,
      }
      : {
        id: `recurring-${expense.id}`,
        name: "Recorrente",
        icon: "🔁",
        color: "hsl(var(--muted-foreground))",
        type: "OUTCOMING" as CategoryType,
      };

    return occurrences.map((date, index) => ({
      id: `recurring-${expense.id}-${date.getTime()}-${index}`,
      description: expense.description,
      amount: Number(expense.amount),
      type: "expense" as const,
      category,
      date,
      paymentMethod: "Recorrente",
      isRecurring: true,
    }));
  });
}

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const { toast } = useToast();

  const openNewTransactionForm = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    if (transaction.id.startsWith("recurring-")) {
      return;
    }

    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const apiType =
    filterType === "income" ? "INCOME" : filterType === "expense" ? "EXPENSE" : undefined;

  const transactionsQuery = useQuery({
    queryKey: [
      "transactions",
      {
        page: 1,
        pageSize: 100,
        type: apiType,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      },
    ],
    queryFn: () =>
      transactionService.listPaginated({
        page: 1,
        pageSize: 100,
        type: apiType,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }),
  });

  const recurringQuery = useQuery({
    queryKey: [
      "recurring-expenses",
      dateRange.from.toISOString(),
      dateRange.to.toISOString(),
    ],
    queryFn: () =>
      recurringExpenseService.listPaginated({
        page: 1,
        pageSize: 100,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }),
  });

  const allTransactions = transactionsQuery.data?.items ?? [];
  const searchTermLower = searchTerm.toLowerCase();

  const matchesFilter = (transactionType: "income" | "expense", description: string, categoryName: string) => {
    const matchesSearch = description.toLowerCase().includes(searchTermLower) ||
      categoryName.toLowerCase().includes(searchTermLower);
    const matchesType = filterType === "all" || transactionType === filterType;
    return matchesSearch && matchesType;
  };

  const filteredTransactions = allTransactions.filter((t) => {
    const transactionDate = t.date;
    const matchesDate = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    return matchesDate && matchesFilter(t.type, t.description, t.category.name);
  });

  const recurringExpenses = recurringQuery.data?.items ?? [];
  const recurringTransactionRows = buildRecurringTransactions(recurringExpenses, dateRange);
  const recurringExpensesTotal = recurringTransactionRows.reduce((acc, expense) => acc + expense.amount, 0);
  const filteredRecurringTransactions = recurringTransactionRows.filter((t) =>
    matchesFilter(t.type, t.description, t.category.name),
  );

  const today = endOfDay(new Date());
  const transactionsUpToToday = filteredTransactions.filter((t) => t.date <= today);
  const recurringTransactionsUpToToday = recurringTransactionRows.filter((t) => t.date <= today);

  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalIncomeUpToToday = transactionsUpToToday
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenseUpToToday = transactionsUpToToday
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const recurringExpensesUpToToday = recurringTransactionsUpToToday.reduce((acc, expense) => acc + expense.amount, 0);
  const totalExpenseWithRecurring = totalExpenseUpToToday + recurringExpensesUpToToday;

  const balanceWithRecurring = totalIncomeUpToToday - (totalExpenseUpToToday + recurringExpensesUpToToday);

  const realizedTransactions = filteredTransactions
    .filter((t) => t.date <= today)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  const futureTransactions = filteredRecurringTransactions
    .filter((t) => t.date > today)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const transactionSections = [
    { key: "realized", title: "Transações realizadas", transactions: realizedTransactions },
    { key: "future", title: "Transações futuras", transactions: futureTransactions },
  ];

  const isListLoading = transactionsQuery.isLoading || recurringQuery.isLoading;

  const handleDeleteTransaction = async (transaction: Transaction) => {
    if (transaction.id.startsWith("recurring-")) {
      return;
    }

    const confirmed = window.confirm("Você tem certeza de que deseja excluir esta transação?");
    if (!confirmed) {
      return;
    }

    try {
      await transactionService.remove(transaction.id);
      toast({
        title: "Transação removida",
        description: "A transação foi excluída com sucesso.",
      });
      transactionsQuery.refetch();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao excluir transação",
        description: apiError.message,
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <TransactionForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setSelectedTransaction(null);
          }
        }}
        transaction={selectedTransaction}
        onSuccess={() => {
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
            Transações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas entradas e saídas
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button variant="income" size="lg" className="gap-2" onClick={openNewTransactionForm}>
            <Plus className="w-5 h-5" />
            <span>Nova Transação</span>
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card variant="elevated" className="border-l-4 border-l-income">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Entradas</div>
              <div className="text-2xl font-bold text-income">{formatCurrency(totalIncome)}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card variant="elevated" className="border-l-4 border-l-expense">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Saídas</div>
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(totalExpenseWithRecurring)}
              </div>
              {recurringExpensesTotal > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Inclui {formatCurrency(recurringExpensesTotal)} em recorrentes
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card variant="elevated" className="border-l-4 border-l-accent">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Gastos Recorrentes</div>
              <div className="text-2xl font-bold text-expense">
                {formatCurrency(recurringExpensesTotal)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card variant="elevated" className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Balanço</div>
              <div className={`text-2xl font-bold ${balanceWithRecurring >= 0 ? "text-income" : "text-expense"}`}>
                {formatCurrency(balanceWithRecurring)}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
          >
            Todas
          </Button>
          <Button
            variant={filterType === "income" ? "income" : "outline"}
            onClick={() => setFilterType("income")}
          >
            Entradas
          </Button>
          <Button
            variant={filterType === "expense" ? "expense" : "outline"}
            onClick={() => setFilterType("expense")}
          >
            Saídas
          </Button>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card variant="elevated">
          <CardContent className="p-0">
            {isListLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="space-y-6 p-4">
                {transactionSections.map((section, sectionIndex) => (
                  <div key={section.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {section.transactions.length} registro{section.transactions.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    {section.transactions.length === 0 ? (
                      <div className="rounded-xl border border-border/60 bg-muted/5 p-4 text-sm text-muted-foreground">
                        Nenhuma transação nessa seção
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50 rounded-xl overflow-hidden">
                        {section.transactions.map((transaction, index) => (
                          <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 + sectionIndex * 0.05 + index * 0.03 }}
                            className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                style={{ backgroundColor: `${transaction.category.color}20` }}
                              >
                                <CategoryIcon iconName={transaction.category.icon} className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">
                                  {transaction.description}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                  <span className="bg-secondary px-2 py-0.5 rounded-md text-xs">
                                    {transaction.category.name}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatFullDate(transaction.date)}
                                  </span>
                                  {transaction.paymentMethod && (
                                    <span className="text-xs">{transaction.paymentMethod}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-lg font-bold ${transaction.type === "income"
                                  ? "text-income"
                                  : "text-expense"
                                  }`}
                              >
                                {transaction.type === "income" ? "+" : "-"}
                                {formatCurrency(transaction.amount)}
                              </span>
                              {transaction.type === "income" ? (
                                <ArrowUpRight className="w-5 h-5 text-income" />
                              ) : (
                                <ArrowDownRight className="w-5 h-5 text-expense" />
                              )}
                              {!transaction.id.startsWith("recurring-") && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleEditTransaction(transaction);
                                    }}
                                    className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground transition"
                                    aria-label="Editar transação"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button
                                        type="button"
                                        className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground transition"
                                        aria-label="Abrir ações"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleDeleteTransaction(transaction);
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default Transactions;