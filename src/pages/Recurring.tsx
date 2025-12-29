import { motion } from "framer-motion";
import { Plus, Calendar, AlertCircle, Pause, Play, MoreHorizontal } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recurringExpenses } from "@/data/mockData";
import { formatCurrency } from "@/lib/finance";

const Recurring = () => {
  const totalMonthly = recurringExpenses
    .filter(e => e.isActive && e.frequency === "monthly")
    .reduce((acc, e) => acc + e.amount, 0);

  const activeCount = recurringExpenses.filter(e => e.isActive).length;

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
            Gastos Recorrentes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas despesas fixas e assinaturas
          </p>
        </div>
        <Button variant="default" size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          <span>Novo Recorrente</span>
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card variant="gradient" className="border-0">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Mensal</div>
              <div className="text-3xl font-bold text-foreground">{formatCurrency(totalMonthly)}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Gastos Ativos</div>
              <div className="text-3xl font-bold text-primary">{activeCount}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Próximo Vencimento</div>
              <div className="text-3xl font-bold text-accent">Dia 1</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recurring Expenses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurringExpenses.map((expense, index) => {
          const today = new Date().getDate();
          const isNearDue = expense.dueDay - today <= 5 && expense.dueDay - today >= 0;
          const isPastDue = expense.dueDay < today;

          return (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + index * 0.05 }}
            >
              <Card variant="elevated" className="hover:shadow-soft-lg transition-all duration-300 group cursor-pointer overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${expense.category.color}20` }}
                      >
                        {expense.category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{expense.description}</h3>
                        <p className="text-sm text-muted-foreground">{expense.category.name}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-2xl font-bold text-foreground mb-4">
                    {formatCurrency(expense.amount)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Vencimento
                      </span>
                      <span className="font-medium flex items-center gap-1.5">
                        Dia {expense.dueDay}
                        {isNearDue && <AlertCircle className="w-4 h-4 text-accent" />}
                      </span>
                    </div>

                    {expense.totalInstallments && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Parcelas</span>
                        <span className="font-medium">
                          {expense.currentInstallment}/{expense.totalInstallments}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Badge 
                        variant={expense.isActive ? "default" : "secondary"}
                        className={expense.isActive ? "bg-income/20 text-income border-0" : ""}
                      >
                        {expense.isActive ? "Ativo" : "Pausado"}
                      </Badge>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        {expense.isActive ? (
                          <>
                            <Pause className="w-3.5 h-3.5" /> Pausar
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Ativar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {expense.totalInstallments && (
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(expense.currentInstallment! / expense.totalInstallments) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="h-full gradient-primary rounded-full"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {expense.totalInstallments - expense.currentInstallment!} parcelas restantes
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Recurring;
