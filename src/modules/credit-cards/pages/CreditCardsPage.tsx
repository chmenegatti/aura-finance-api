import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Calendar, CreditCard as CreditCardIcon, Plus, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/finance";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/types/api";

import { CreditCardCarousel } from "../components/CreditCardCarousel";
import { CreditCardForm } from "../components/CreditCardForm";
import { useCreditCardInvoice } from "../hooks/useInvoices";
import { useCreditCards } from "../hooks/useCreditCards";

const getCurrentMonth = () => format(new Date(), "yyyy-MM");

export default function CreditCardsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: cards = [], isLoading, error, refetch } = useCreditCards();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const month = useMemo(getCurrentMonth, []);
  const invoiceQuery = useCreditCardInvoice(activeCardId ?? undefined, month);
  const activeCard = cards.find((card) => card.id === activeCardId);
  const expenses = invoiceQuery.data?.expenses ?? [];
  const totalUsed = invoiceQuery.data?.total ?? 0;
  const usageValue = activeCard ? Math.min(Math.max(totalUsed / activeCard.creditLimit, 0), 1) * 100 : 0;
  const todayDate = new Date().getDate();
  const dueDay = activeCard?.dueDay ?? todayDate;
  const daysUntilDue = activeCard
    ? dueDay >= todayDate
      ? dueDay - todayDate
      : 30 - todayDate + dueDay
    : 0;
  const isUrgent = activeCard ? daysUntilDue <= 3 : false;
  const available = activeCard ? Math.max(activeCard.creditLimit - totalUsed, 0) : 0;
  const largestExpense = expenses.length ? Math.max(...expenses.map((expense) => expense.amount)) : 0;
  const averageExpense = expenses.length
    ? expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length
    : 0;

  useEffect(() => {
    if (cards.length > 0 && !activeCardId) {
      setActiveCardId(cards[0].id);
    }
  }, [cards, activeCardId]);

  useEffect(() => {
    if (error) {
      const apiError = error as ApiError;
      toast({
        title: "Não foi possível carregar os cartões",
        description: apiError.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (invoiceQuery.error) {
      const apiError = invoiceQuery.error as ApiError;
      toast({
        title: "Erro ao carregar a fatura",
        description: apiError.message,
        variant: "destructive",
      });
    }
  }, [invoiceQuery.error, toast]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Carteira 💳</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus cartões ativos e acompanhe suas faturas.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="income"
              disabled={!activeCardId}
              onClick={() => {
                if (activeCardId) {
                  navigate(`/credit-cards/${activeCardId}`);
                }
              }}
            >
              Ver detalhes
            </Button>
            <Button variant="outline" onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo cartão
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative rounded-[32px] border border-border/60 bg-card/80 p-6 shadow-soft-xl backdrop-blur"
        >
          <CreditCardCarousel
            cards={cards}
            isLoading={isLoading}
            invoice={invoiceQuery.data}
            activeCardId={activeCardId ?? undefined}
            onCardSelect={(cardId) => setActiveCardId(cardId)}
          />
        </motion.div>

        {activeCard ? (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-soft-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-2xl bg-muted/20 p-2 text-emerald-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Uso do limite</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Utilizado</span>
                    <span className="font-medium text-foreground">{formatCurrency(totalUsed)}</span>
                  </div>
                  <Progress value={usageValue} className="h-3 rounded-full bg-muted" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Disponível</span>
                    <span className="font-medium text-emerald-400">{formatCurrency(available)}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "rounded-3xl border p-6 shadow-soft-xl",
                  isUrgent ? "border-expense/60" : "border-border/50",
                  "bg-card/70",
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-2xl bg-muted/20 p-2 text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Vencimento</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className={cn("text-4xl font-display font-bold", isUrgent && "text-expense")}>{activeCard ? daysUntilDue : 0}</span>
                    <span className="text-sm text-muted-foreground">dias restantes</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>📅 Fechamento: dia {activeCard.closingDay}</p>
                    <p>💰 Vencimento: dia {activeCard.dueDay}</p>
                  </div>
                  {isUrgent && (
                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-expense/40 bg-expense/10 p-2 text-xs text-expense">
                      <AlertCircle className="h-4 w-4" />
                      <span>Fatura vence em breve!</span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-soft-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-2xl bg-muted/20 p-2 text-foreground">
                    <CreditCardIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Este mês</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Transações</span>
                    <span className="font-medium text-foreground">{expenses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maior compra</span>
                    <span className="font-medium text-foreground">{formatCurrency(largestExpense)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Média</span>
                    <span className="font-medium text-foreground">{formatCurrency(averageExpense)}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-soft-xl"
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-foreground">Compras neste cartão</h3>
              <div className="space-y-3">
                {expenses.length ? (
                  expenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                      className="flex items-center justify-between rounded-2xl border border-border/40 bg-muted/10 p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(expense.purchaseDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <span className="font-display text-expense">-{formatCurrency(expense.amount)}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground">Nenhuma transação registrada neste cartão.</p>
                )}
              </div>
            </motion.div>
          </>
        ) : (
          <div className="rounded-3xl border border-border/50 bg-card/70 p-8 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Adicione um cartão para começar a acompanhar limites e faturas.</p>
            <p>Suas compras aparecerão aqui assim que houver dados.</p>
          </div>
        )}

        <CreditCardForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSuccess={() => {
            refetch();
            setIsFormOpen(false);
          }}
        />
      </div>
    </MainLayout>
  );
}
