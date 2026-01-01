import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarIcon,
  Upload,
  X,
  DollarSign,
  FileText,
  CreditCard,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { categoryService } from "@/services/category.service";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { transactionService } from "@/services/transaction.service";
import { receiptService } from "@/services/receipt.service";
import type { Category } from "@/types/category";
import type { TransactionApiType } from "@/types/transaction";
import type { ApiError } from "@/types/api";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const paymentMethods = [
  "PIX",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Dinheiro",
  "Transferência",
  "Boleto",
];

// Categorias de entrada (income)
const incomeCategories: Category[] = [
  { id: "income-salary", name: "Salário", icon: "Wallet", color: "hsl(142, 76%, 36%)" },
  { id: "income-reimbursement", name: "Reembolsos", icon: "RotateCcw", color: "hsl(200, 70%, 50%)" },
  { id: "income-dividends", name: "Dividendos", icon: "TrendingUp", color: "hsl(280, 60%, 50%)" },
  { id: "income-freelance", name: "Freelance", icon: "Briefcase", color: "hsl(43, 90%, 55%)" },
  { id: "income-investments", name: "Investimentos", icon: "LineChart", color: "hsl(173, 58%, 39%)" },
  { id: "income-rental", name: "Aluguel Recebido", icon: "Home", color: "hsl(15, 90%, 60%)" },
  { id: "income-gifts", name: "Presentes", icon: "Gift", color: "hsl(330, 65%, 55%)" },
  { id: "income-other", name: "Outras Entradas", icon: "Plus", color: "hsl(210, 15%, 50%)" },
];

export const TransactionForm = ({ open, onOpenChange, onSuccess }: TransactionFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  // Reset category when type changes
  useEffect(() => {
    setCategoryId("");
  }, [type]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.list();
      setExpenseCategories(data);
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao carregar categorias",
        description: apiError.message,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setType("expense");
    setDescription("");
    setAmount("");
    setCategoryId("");
    setDate(new Date());
    setPaymentMethod("");
    setNotes("");
    setAttachments([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For income, payment method is not required
    const isPaymentMethodRequired = type === "expense";

    if (!description || !amount || !categoryId || (isPaymentMethodRequired && !paymentMethod)) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Convert type to API format
      const apiType: TransactionApiType = type === "income" ? "INCOME" : "EXPENSE";

      // Create transaction
      const transaction = await transactionService.create({
        description,
        amount: parseFloat(amount),
        type: apiType,
        categoryId,
        date: date.toISOString(),
        paymentMethod: type === "income" ? "Transferência" : paymentMethod, // Default for income
        isRecurring: false,
      });

      // Upload attachments if any
      for (const file of attachments) {
        try {
          await receiptService.upload({
            transactionId: transaction.id,
            file,
          });
        } catch (error) {
          console.error("Failed to upload attachment:", error);
        }
      }

      toast({
        title: "Transação registrada!",
        description: `${type === "income" ? "Entrada" : "Saída"} de R$ ${amount} adicionada com sucesso.`,
      });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao criar transação",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Select categories based on type
  const availableCategories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Nova Transação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
            <button
              type="button"
              onClick={() => setType("income")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all",
                type === "income"
                  ? "bg-income text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowUpRight className="w-5 h-5" />
              Entrada
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all",
                type === "expense"
                  ? "bg-expense text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowDownRight className="w-5 h-5" />
              Saída
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Valor *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                R$
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-lg font-semibold h-12"
              />
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
              placeholder={type === "income" ? "Ex: Salário mensal" : "Ex: Compra no supermercado"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Category and Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Categoria *
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione">
                    {categoryId && (() => {
                      const selectedCategory = availableCategories.find(c => c.id === categoryId);
                      return selectedCategory ? (
                        <div className="flex items-center gap-2">
                          <CategoryIcon iconName={selectedCategory.icon} className="w-4 h-4" />
                          <span>{selectedCategory.name}</span>
                        </div>
                      ) : "Selecione";
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <CategoryIcon iconName={category.icon} className="w-4 h-4" />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                Data *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Payment Method - Only for expenses */}
          <AnimatePresence>
            {type === "expense" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <Label className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Forma de Pagamento *
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Observações
            </Label>
            <Textarea
              id="notes"
              placeholder="Adicione notas ou detalhes sobre esta transação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              Comprovantes
            </Label>
            <div
              className="border-2 border-dashed border-border/60 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Clique ou arraste arquivos aqui
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Imagens ou PDFs
              </p>
            </div>

            {/* Attachment List */}
            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {attachments.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={type === "income" ? "income" : "expense"}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  {type === "income" ? "Registrar Entrada" : "Registrar Saída"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};