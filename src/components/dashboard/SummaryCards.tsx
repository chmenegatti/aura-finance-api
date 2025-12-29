import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/finance";
import { FinancialSummary } from "@/types/finance";

interface SummaryCardsProps {
  summary: FinancialSummary;
}

const cardData = [
  {
    key: "balance",
    label: "Saldo Atual",
    icon: Wallet,
    gradient: "gradient-primary",
    iconBg: "bg-primary-foreground/20",
    textColor: "text-primary-foreground",
  },
  {
    key: "totalIncome",
    label: "Entradas",
    icon: TrendingUp,
    gradient: "gradient-income",
    iconBg: "bg-income-foreground/20",
    textColor: "text-income-foreground",
  },
  {
    key: "totalExpense",
    label: "Saídas",
    icon: TrendingDown,
    gradient: "gradient-expense",
    iconBg: "bg-expense-foreground/20",
    textColor: "text-expense-foreground",
  },
  {
    key: "savings",
    label: "Economia",
    icon: PiggyBank,
    gradient: "gradient-accent",
    iconBg: "bg-accent-foreground/20",
    textColor: "text-accent-foreground",
  },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cardData.map((item, index) => {
        const Icon = item.icon;
        const value = summary[item.key as keyof FinancialSummary];

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`${item.gradient} border-0 overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300`}>
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${item.iconBg} p-2.5 rounded-xl`}>
                    <Icon className={`h-5 w-5 ${item.textColor}`} />
                  </div>
                  <div className={`text-xs font-medium ${item.textColor} opacity-80`}>
                    Este mês
                  </div>
                </div>
                <div className={`text-2xl md:text-3xl font-bold ${item.textColor} mb-1`}>
                  {formatCurrency(value)}
                </div>
                <div className={`text-sm ${item.textColor} opacity-80`}>
                  {item.label}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
