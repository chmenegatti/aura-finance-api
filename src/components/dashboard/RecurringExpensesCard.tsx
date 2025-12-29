import { motion } from "framer-motion";
import { Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecurringExpense } from "@/types/finance";
import { formatCurrency } from "@/lib/finance";

interface RecurringExpensesCardProps {
  expenses: RecurringExpense[];
  limit?: number;
}

export function RecurringExpensesCard({ expenses, limit }: RecurringExpensesCardProps) {
  const displayExpenses = limit ? expenses.slice(0, limit) : expenses;
  const totalMonthly = expenses
    .filter(e => e.isActive && e.frequency === "monthly")
    .reduce((acc, e) => acc + e.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card variant="elevated" className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Gastos Recorrentes</CardTitle>
            <div className="text-sm font-medium text-primary">
              {formatCurrency(totalMonthly)}/mês
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {displayExpenses.map((expense, index) => {
              const today = new Date().getDate();
              const isNearDue = expense.dueDay - today <= 5 && expense.dueDay - today >= 0;
              
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${expense.category.color}20` }}
                    >
                      {expense.category.icon}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm flex items-center gap-2">
                        {expense.description}
                        {isNearDue && (
                          <AlertCircle className="w-3.5 h-3.5 text-accent" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>Dia {expense.dueDay}</span>
                        {expense.totalInstallments && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                            <span>{expense.currentInstallment}/{expense.totalInstallments}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(expense.amount)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
