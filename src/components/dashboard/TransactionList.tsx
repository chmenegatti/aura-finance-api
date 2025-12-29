import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/finance";
import { formatCurrency, formatDate } from "@/lib/finance";

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

export function TransactionList({ transactions, limit }: TransactionListProps) {
  const displayTransactions = limit 
    ? transactions.slice(0, limit) 
    : transactions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card variant="elevated" className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Últimas Transações</CardTitle>
            <button className="text-sm text-primary font-medium hover:underline transition-all">
              Ver todas
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {displayTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${transaction.category.color}20` }}
                  >
                    {transaction.category.icon}
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{transaction.category.name}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-income"
                        : "text-expense"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="w-4 h-4 text-income" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-expense" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
