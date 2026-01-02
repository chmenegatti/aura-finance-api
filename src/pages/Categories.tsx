import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { startOfMonth, endOfMonth } from "date-fns";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/finance";
import { cn } from "@/lib/utils";
import { categoryService, recurringExpenseService, transactionService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { useToast } from "@/hooks/use-toast";
import type { ApiError } from "@/types/api";
import type { Category } from "@/types/category";

const Categories = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const { toast } = useToast();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.list(),
  });

  const transactionsQuery = useQuery({
    queryKey: ["transactions", { page: 1, pageSize: 500 }],
    queryFn: () => transactionService.listPaginated({ page: 1, pageSize: 500 }),
  });

  const recurringQuery = useQuery({
    queryKey: ["recurring-expenses", { page: 1, pageSize: 100 }],
    queryFn: () => recurringExpenseService.listPaginated({ page: 1, pageSize: 100 }),
  });

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingCategory(null);
    }
  };

  const openCategoryForm = (category?: Category | null) => {
    setEditingCategory(category ?? null);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    const confirmed = window.confirm(`Deseja remover a categoria "${category.name}"?`);
    if (!confirmed) return;

    setDeletingCategoryId(category.id);

    try {
      await categoryService.remove(category.id);
      toast({
        title: "Categoria removida",
        description: `A categoria "${category.name}" foi excluída.`,
      });
      await categoriesQuery.refetch();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao remover",
        description: apiError.message || "Não foi possível remover a categoria.",
        variant: "destructive",
      });
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const categories = categoriesQuery.data ?? [];
  const transactions = transactionsQuery.data?.items ?? [];
  const recurringExpenses = recurringQuery.data?.items ?? [];

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const currentMonthRecurring = recurringExpenses.filter(recurring => {
    const startDate = new Date(recurring.startDate);
    const endDate = recurring.endDate ? new Date(recurring.endDate) : null;
    return startDate <= monthEnd && (!endDate || endDate >= monthStart);
  });
  const recurringMonthlyTotal = currentMonthRecurring.reduce(
    (acc, recurring) => acc + Number(recurring.amount),
    0,
  );

  const baseCategorySpending = categories.map(category => {
    const expenses = transactions.filter(
      t => t.category.id === category.id && t.type === "expense",
    );
    const incomes = transactions.filter(
      t => t.category.id === category.id && t.type === "income",
    );

    const total = expenses.reduce((acc, t) => acc + t.amount, 0);
    const income = incomes.reduce((acc, t) => acc + t.amount, 0);

    return {
      ...category,
      totalExpense: total,
      totalIncome: income,
      transactionCount: transactions.filter(t => t.category.id === category.id).length,
      recurringShare: 0,
      totalExpenseWithRecurring: total,
    };
  });

  const totalExpenseSum = baseCategorySpending.reduce((acc, category) => acc + category.totalExpense, 0);
  const outgoingCategoriesCount = baseCategorySpending.filter(c => c.type === "OUTCOMING").length;

  const categorySpending = baseCategorySpending.map(category => {
    const share = totalExpenseSum > 0
      ? (category.totalExpense / totalExpenseSum) * recurringMonthlyTotal
      : category.type === "OUTCOMING" && outgoingCategoriesCount > 0
        ? recurringMonthlyTotal / outgoingCategoriesCount
        : 0;

    return {
      ...category,
      recurringShare: share,
      totalExpenseWithRecurring: category.totalExpense + share,
    };
  });

  const maxSpending = Math.max(
    0,
    ...categorySpending.map(c => c.totalExpenseWithRecurring + c.totalIncome),
  );

  return (
    <MainLayout>
      <CategoryForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSuccess={() => categoriesQuery.refetch()}
        category={editingCategory}
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
            Categorias
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize suas transações por categorias
          </p>
        </div>
        <Button variant="default" size="lg" className="gap-2" onClick={() => openCategoryForm()}>
          <Plus className="w-5 h-5" />
          <span>Nova Categoria</span>
        </Button>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(categoriesQuery.isLoading || transactionsQuery.isLoading || recurringQuery.isLoading) ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))
        ) : categorySpending.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Nenhuma categoria encontrada
          </div>
        ) : categorySpending.map((category, index) => {
          const totalValue = category.totalExpenseWithRecurring + category.totalIncome;
          const percentage = maxSpending > 0 ? (totalValue / maxSpending) * 100 : 0;
          const isIncomeCategory = category.type === "INCOMING";
          const cardTone = isIncomeCategory
            ? "bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 border border-emerald-200"
            : "bg-gradient-to-br from-rose-50 via-rose-100 to-rose-50 border border-rose-200";

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card
                variant="elevated"
                className={cn(
                  "hover:shadow-soft-lg transition-all duration-300 group cursor-pointer overflow-hidden",
                  cardTone,
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-soft-sm"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <CategoryIcon iconName={category.icon} className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-lg">{category.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {category.transactionCount} transações
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openCategoryForm(category)}
                        aria-label="Editar categoria"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCategory(category)}
                        disabled={deletingCategoryId === category.id}
                        aria-label="Excluir categoria"
                      >
                        {deletingCategoryId === category.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
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

                    {category.recurringShare > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Recorrentes deste mês</span>
                          <span className="font-semibold text-expense">
                            {formatCurrency(category.recurringShare)}
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
