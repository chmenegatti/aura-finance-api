import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/mockData";
import { formatCurrency } from "@/lib/finance";
import { transactions } from "@/data/mockData";

const Categories = () => {
  // Calculate spending per category
  const categorySpending = categories.map(category => {
    const total = transactions
      .filter(t => t.category.id === category.id && t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    
    const income = transactions
      .filter(t => t.category.id === category.id && t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      ...category,
      totalExpense: total,
      totalIncome: income,
      transactionCount: transactions.filter(t => t.category.id === category.id).length,
    };
  });

  const maxSpending = Math.max(...categorySpending.map(c => c.totalExpense + c.totalIncome));

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
            Categorias
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize suas transações por categorias
          </p>
        </div>
        <Button variant="default" size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          <span>Nova Categoria</span>
        </Button>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorySpending.map((category, index) => {
          const totalValue = category.totalExpense + category.totalIncome;
          const percentage = maxSpending > 0 ? (totalValue / maxSpending) * 100 : 0;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card variant="elevated" className="hover:shadow-soft-lg transition-all duration-300 group cursor-pointer overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-soft-sm"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.transactionCount} transações
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.totalExpense > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Gastos</span>
                          <span className="font-semibold text-expense">
                            {formatCurrency(category.totalExpense)}
                          </span>
                        </div>
                      </div>
                    )}

                    {category.totalIncome > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Entradas</span>
                          <span className="font-semibold text-income">
                            {formatCurrency(category.totalIncome)}
                          </span>
                        </div>
                      </div>
                    )}

                    {totalValue > 0 && (
                      <div className="pt-2">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                      </div>
                    )}

                    {totalValue === 0 && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        Nenhuma transação ainda
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Categories;
