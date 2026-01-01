import { useState } from "react";
import { motion } from "framer-motion";
import { startOfMonth, endOfMonth } from "date-fns";
import { Plus, Search, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatFullDate } from "@/lib/finance";
import { transactionService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DateRangeFilter, DateRange } from "@/components/filters/DateRangeFilter";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const apiType =
    filterType === "income" ? "INCOME" : filterType === "expense" ? "EXPENSE" : undefined;

  const transactionsQuery = useQuery({
    queryKey: ["transactions", { page: 1, pageSize: 100, type: apiType, startDate: dateRange.from.toISOString(), endDate: dateRange.to.toISOString() }],
    queryFn: () => transactionService.listPaginated({ page: 1, pageSize: 100, type: apiType }),
  });

  const allTransactions = transactionsQuery.data?.items ?? [];

  const filteredTransactions = allTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    const transactionDate = t.date;
    const matchesDate = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    return matchesSearch && matchesType && matchesDate;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <MainLayout>
      <TransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => transactionsQuery.refetch()}
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
          <Button variant="income" size="lg" className="gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-5 h-5" />
            <span>Nova Transação</span>
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
              <div className="text-2xl font-bold text-expense">{formatCurrency(totalExpense)}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card variant="elevated" className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Balanço</div>
              <div className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(totalIncome - totalExpense)}
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
            {transactionsQuery.isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhuma transação encontrada
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {filteredTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.03 }}
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
                    </div>
                  </motion.div>
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