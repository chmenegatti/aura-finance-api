import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { categoryService } from "@/services/category.service";
import type { ApiError } from "@/types/api";
import type { Category, CategoryType } from "@/types/category";

const ICON_OPTIONS = [
  { value: "briefcase", label: "💼 Salário" },
  { value: "shopping-cart", label: "🛒 Supermercado" },
  { value: "utensils", label: "🍽️ Alimentação" },
  { value: "coffee", label: "☕ Restaurantes" },
  { value: "home", label: "🏠 Moradia" },
  { value: "key", label: "🔑 Aluguel" },
  { value: "building", label: "🏢 Condomínio" },
  { value: "bolt", label: "⚡ Energia" },
  { value: "tint", label: "💧 Água" },
  { value: "wifi", label: "📡 Internet" },
  { value: "phone", label: "📞 Telefone" },
  { value: "car", label: "🚗 Transporte" },
  { value: "gas-pump", label: "⛽ Combustível" },
  { value: "heartbeat", label: "❤️ Saúde" },
  { value: "pills", label: "💊 Farmácia" },
  { value: "graduation-cap", label: "🎓 Educação" },
  { value: "gamepad", label: "🎮 Lazer" },
  { value: "plane", label: "✈️ Viagem" },
  { value: "shopping-bag", label: "🛍️ Compras" },
  { value: "t-shirt", label: "👕 Roupas" },
  { value: "cut", label: "✂️ Beleza" },
  { value: "dumbbell", label: "🏋️ Academia" },
  { value: "tv", label: "📺 Assinaturas" },
  { value: "paw", label: "🐾 Pets" },
  { value: "baby", label: "👶 Filhos" },
  { value: "gift", label: "🎁 Presentes" },
  { value: "credit-card", label: "💳 Dívidas" },
  { value: "university", label: "🏦 Taxas bancárias" },
  { value: "chart-line", label: "📈 Investimentos" },
  { value: "chart-pie", label: "📊 Dividendos" },
  { value: "laptop-code", label: "💻 Freelance" },
  { value: "tags", label: "🏷️ Vendas" },
  { value: "plus-circle", label: "➕ Renda extra" },
  { value: "undo-alt", label: "↩️ Reembolso" },
  { value: "hand-holding-heart", label: "❤️ Doações" },
  { value: "file-invoice-dollar", label: "📄 Impostos" },
  { value: "ellipsis-h", label: "⋯ Outros" },
];

const COLOR_OPTIONS = [
  "#16a34a",
  "#22c55e",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#64748b",
  "#6b7280",
];

const TYPE_OPTIONS: { value: CategoryType; label: string; description: string }[] = [
  { value: "INCOMING", label: "Receita", description: "Entradas" },
  { value: "OUTCOMING", label: "Despesa", description: "Saídas" },
];

const DEFAULT_ICON = "ellipsis-h";
const DEFAULT_COLOR = "#6366f1";
const DEFAULT_CATEGORY_TYPE: CategoryType = "OUTCOMING";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  category?: Category | null;
}

export const CategoryForm = ({
  open,
  onOpenChange,
  onSuccess,
  category,
}: CategoryFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(DEFAULT_ICON);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [type, setType] = useState<CategoryType>(DEFAULT_CATEGORY_TYPE);

  const isEditing = Boolean(category);

  const resetForm = () => {
    setName("");
    setIcon(DEFAULT_ICON);
    setColor(DEFAULT_COLOR);
    setType(DEFAULT_CATEGORY_TYPE);
  };

  useEffect(() => {
    if (!open) return;

    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
      setType(category.type);
    } else {
      resetForm();
    }
  }, [open, category]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o nome da categoria.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && category) {
        await categoryService.update(category.id, {
          name: name.trim(),
          icon,
          color,
          type,
        });
      } else {
        await categoryService.create({
          name: name.trim(),
          icon,
          color,
          type,
        });
      }

      toast({
        title: isEditing ? "Categoria atualizada" : "Categoria criada",
        description: isEditing
          ? `A categoria "${name}" foi atualizada.`
          : `A categoria "${name}" foi criada com sucesso.`,
      });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro",
        description: apiError.message || "Não foi possível salvar a categoria.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category) return;

    const confirmed = window.confirm(`Deseja remover a categoria "${category.name}"?`);
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await categoryService.remove(category.id);
      toast({
        title: "Categoria removida",
        description: `A categoria "${category.name}" foi excluída.`,
      });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao excluir",
        description: apiError.message || "Não foi possível remover a categoria.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Nome da categoria *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Transporte, Lazer, etc."
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-3">
              {TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${type === option.value
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-foreground"
                    }`}
                >
                  {option.value === "INCOMING" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <div>
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
              {ICON_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setIcon(option.value)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-2xl transition-all hover:scale-110 ${icon === option.value
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : "bg-secondary hover:bg-secondary/80"
                    }`}
                  title={option.label}
                >
                  {option.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-10 gap-2">
              {COLOR_OPTIONS.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`aspect-square rounded-lg transition-all hover:scale-110 ${color === colorOption ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  style={{ backgroundColor: colorOption }}
                  title={colorOption}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pré-visualização</Label>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${color}20` }}
              >
                {ICON_OPTIONS.find((opt) => opt.value === icon)?.label.split(" ")[0] || "📌"}
              </div>
              <span className="font-medium">{name || "Nome da categoria"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleDelete}
                disabled={isDeleting || isLoading}
              >
                {isDeleting ? "Excluindo..." : "Excluir categoria"}
              </Button>
            )}
            <div className="flex flex-1 gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  resetForm();
                }}
                disabled={isLoading || isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="default"
                className="flex-1"
                disabled={isLoading || isDeleting}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : isEditing ? (
                  "Atualizar categoria"
                ) : (
                  "Criar categoria"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
