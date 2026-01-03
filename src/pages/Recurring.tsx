import { motion } from "framer-motion";
import { Plus, Calendar, AlertCircle, Pause, Play, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/finance";
import { recurringExpenseService } from "@/services";
import type { RecurringExpense, RecurringExpenseDTO } from "@/types/recurringExpense";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { RecurringExpenseForm } from "@/components/recurring/RecurringExpenseForm";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { ApiError } from "@/types/api";

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

const Recurring = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecurringExpense, setSelectedRecurringExpense] = useState<RecurringExpenseDTO | null>(null);
  const { toast } = useToast();

  const recurringQuery = useQuery({
    queryKey: ["recurring-expenses", { page: 1, pageSize: 100 }],
    queryFn: () => recurringExpenseService.listPaginated({ page: 1, pageSize: 100 }),
  });

  const recurringDtos = recurringQuery.data?.items ?? [];
  const recurringExpenses = recurringDtos.map(mapRecurringToUi);

  const handleEditRecurring = (expense: RecurringExpenseDTO) => {
    setSelectedRecurringExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteRecurring = async (expense: RecurringExpenseDTO) => {
    const confirmed = window.confirm("Tem certeza de que deseja excluir este gasto recorrente?");
    if (!confirmed) {
      return;
    }

    try {
      await recurringExpenseService.remove(expense.id);
      toast({
        title: "Gasto recorrente removido",
        description: `"${expense.description}" foi excluído.`,
      });
      recurringQuery.refetch();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao excluir gasto recorrente",
        description: apiError.message,
        variant: "destructive",
      });
    }
  };

  const totalMonthly = recurringExpenses
    .filter(e => e.isActive && e.frequency === "monthly")
    .reduce((acc, e) => acc + e.amount, 0);

  const activeCount = recurringExpenses.filter(e => e.isActive).length;

  return (
    <MainLayout>
      <RecurringExpenseForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setSelectedRecurringExpense(null);
          }
        }}
        onSuccess={() => recurringQuery.refetch()}
        recurringExpense={selectedRecurringExpense}
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
            Gastos Recorrentes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas despesas fixas e assinaturas
          </p>
        </div>
        <Button
          variant="default"
          size="lg"
          className="gap-2"
          onClick={() => {
            setSelectedRecurringExpense(null);
            setIsFormOpen(true);
          }}
        >
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
        {recurringQuery.isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))
        ) : recurringExpenses.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Nenhum recorrente encontrado
          </div>
        ) : recurringExpenses.map((expense, index) => {
          const dto = recurringDtos[index];
          if (!dto) {
            return null;
          }
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
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${expense.category.color}20` }}
                      >
                        <CategoryIcon iconName={expense.category.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{expense.description}</h3>
                        <p className="text-sm text-muted-foreground">{expense.category.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        aria-label="Editar gasto recorrente"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditRecurring(dto);
                        }}
                        className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            aria-label="Abrir menu do gasto recorrente"
                            onClick={(event) => event.stopPropagation()}
                            className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground transition"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteRecurring(dto);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
    </MainLayout >
  );
};

export default Recurring;
