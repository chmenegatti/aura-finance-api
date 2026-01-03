import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, DollarSign, FileText, Repeat } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { recurringExpenseService } from "@/services/recurringExpense.service";
import { categoryService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/types/api";
import type {
  RecurringExpenseDTO,
  RecurringFrequencyApi,
  RecurringExpenseTypeApi,
} from "@/types/recurringExpense";

interface RecurringExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  recurringExpense?: RecurringExpenseDTO | null;
}

const EXPENSE_TYPES: { value: RecurringExpenseTypeApi; label: string; icon: string }[] = [
  { value: "FINANCING", label: "Financiamento", icon: "🚗" },
  { value: "LOAN", label: "Empréstimo", icon: "🏦" },
  { value: "SUBSCRIPTION", label: "Assinatura", icon: "🔁" },
  { value: "OTHER", label: "Outro", icon: "📌" },
];

const FREQUENCY_OPTIONS: { value: RecurringFrequencyApi; label: string }[] = [
  { value: "MONTHLY", label: "Mensal" },
  { value: "YEARLY", label: "Anual" },
  { value: "CUSTOM", label: "Personalizado" },
];

export const RecurringExpenseForm = ({ open, onOpenChange, onSuccess, recurringExpense }: RecurringExpenseFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<RecurringExpenseTypeApi>("SUBSCRIPTION");
  const [frequency, setFrequency] = useState<RecurringFrequencyApi>("MONTHLY");
  const [customIntervalDays, setCustomIntervalDays] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [totalInstallments, setTotalInstallments] = useState("12");
  const [currentInstallment, setCurrentInstallment] = useState("0");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const isEditMode = Boolean(recurringExpense);
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.list(),
  });

  const categories = categoriesQuery.data ?? [];

  useEffect(() => {
    if (!recurringExpense && !selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, recurringExpense, selectedCategoryId]);

  useEffect(() => {
    if (!recurringExpense) {
      return;
    }

    setDescription(recurringExpense.description);
    setAmount(recurringExpense.amount);
    setType(recurringExpense.type);
    setFrequency(recurringExpense.frequency);
    setCustomIntervalDays(recurringExpense.customIntervalDays?.toString() ?? "");
    setStartDate(new Date(recurringExpense.startDate));
    setEndDate(recurringExpense.endDate ? new Date(recurringExpense.endDate) : undefined);
    setTotalInstallments(recurringExpense.totalInstallments.toString());
    setCurrentInstallment(recurringExpense.currentInstallment.toString());
    setSelectedCategoryId(recurringExpense.categoryId);
  }, [recurringExpense]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("SUBSCRIPTION");
    setFrequency("MONTHLY");
    setCustomIntervalDays("");
    setStartDate(new Date());
    setEndDate(undefined);
    setTotalInstallments("12");
    setCurrentInstallment("0");
    setSelectedCategoryId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !totalInstallments) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (frequency === "CUSTOM" && !customIntervalDays) {
      toast({
        title: "Campo obrigatório",
        description: "Para frequência personalizada, informe o intervalo em dias.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCategoryId) {
      toast({
        title: "Categoria obrigatória",
        description: "Selecione a categoria associada ao gasto recorrente.",
        variant: "destructive",
      });
      return;
    }

    const parsedCustomInterval =
      frequency === "CUSTOM" ? parseInt(customIntervalDays, 10) : undefined;
    const totalInstallmentsValue = parseInt(totalInstallments, 10) || 0;
    const currentInstallmentValue = parseInt(currentInstallment, 10) || 0;
    const payload = {
      description: description.trim(),
      amount: parseFloat(amount),
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : undefined,
      frequency,
      customIntervalDays: parsedCustomInterval,
      totalInstallments: totalInstallmentsValue,
      currentInstallment: currentInstallmentValue,
      type,
      categoryId: selectedCategoryId,
    };

    setIsLoading(true);

    try {
      if (isEditMode && recurringExpense) {
        await recurringExpenseService.update(recurringExpense.id, payload);
        toast({
          title: "Gasto recorrente atualizado!",
          description: `"${description}" foi atualizado com sucesso.`,
        });
      } else {
        await recurringExpenseService.create(payload);
        toast({
          title: "Gasto recorrente criado!",
          description: `"${description}" foi adicionado com sucesso.`,
        });
      }

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao criar gasto recorrente",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditMode ? "Editar Gasto Recorrente" : "Novo Gasto Recorrente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Type Selector */}
          <div className="space-y-2">
            <Label>Tipo de Gasto</Label>
            <div className="grid grid-cols-2 gap-2">
              {EXPENSE_TYPES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    type === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Descrição *
            </Label>
            <Input
              id="description"
              placeholder="Ex: Netflix, Aluguel, Financiamento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Valor *
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={(value) => setSelectedCategoryId(value)}
              disabled={categoriesQuery.isLoading && !categories.length}
            >
              <SelectTrigger id="category" className="h-12">
                <SelectValue placeholder={categories.length ? "Selecione" : "Carregando..."} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-primary" />
              Frequência *
            </Label>
            <Select value={frequency} onValueChange={(value) => setFrequency(value as RecurringFrequencyApi)}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Interval Days (only if frequency is CUSTOM) */}
          {frequency === "CUSTOM" && (
            <div className="space-y-2">
              <Label htmlFor="customIntervalDays">Intervalo em Dias *</Label>
              <Input
                id="customIntervalDays"
                type="number"
                placeholder="Ex: 15, 30, 90..."
                value={customIntervalDays}
                onChange={(e) => setCustomIntervalDays(e.target.value)}
                className="h-12"
              />
            </div>
          )}

          {/* Installments */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalInstallments">Total de Parcelas *</Label>
              <Input
                id="totalInstallments"
                type="number"
                min="1"
                value={totalInstallments}
                onChange={(e) => setTotalInstallments(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentInstallment">Parcela Atual</Label>
              <Input
                id="currentInstallment"
                type="number"
                min="0"
                value={currentInstallment}
                onChange={(e) => setCurrentInstallment(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" />
              Data de Início *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date (Optional) */}
          <div className="space-y-2">
            <Label>Data de Término (Opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Sem data final"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date < startDate}
                />
              </PopoverContent>
            </Popover>
            {endDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEndDate(undefined)}
                className="text-xs"
              >
                Remover data final
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                isEditMode ? "Salvar alterações" : "Criar Gasto"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
