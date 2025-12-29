import { motion } from "framer-motion";
import { Plus, Bell } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExpensesPieChart } from "@/components/dashboard/ExpensesPieChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { RecurringExpensesCard } from "@/components/dashboard/RecurringExpensesCard";
import { Button } from "@/components/ui/button";
import { transactions, recurringExpenses, monthlyData, balanceHistory } from "@/data/mockData";
import { calculateSummary, getExpensesByCategory } from "@/lib/finance";

const Dashboard = () => {
  const summary = calculateSummary(transactions);
  const expensesByCategory = getExpensesByCategory(transactions);

  return (
    <MainLayout>
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
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>
          <Button variant="income" size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nova Transação</span>
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ExpensesPieChart data={expensesByCategory} />
        <IncomeExpenseChart data={monthlyData} />
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
