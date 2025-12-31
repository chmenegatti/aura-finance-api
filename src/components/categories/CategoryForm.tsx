import { useState } from "react";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
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

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

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
  "#16a34a", // green
  "#22c55e", // light green
  "#0ea5e9", // blue
  "#3b82f6", // sky blue
  "#6366f1", // indigo
  "#8b5cf6", // purple
  "#a855f7", // violet
  "#ec4899", // pink
  "#f43f5e", // rose
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#eab308", // yellow
  "#84cc16", // lime
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#64748b", // slate
  "#6b7280", // gray
];

export const CategoryForm = ({ open, onOpenChange, onSuccess }: CategoryFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("ellipsis-h");
  const [color, setColor] = useState("#6366f1");

  const resetForm = () => {
    setName("");
    setIcon("ellipsis-h");
    setColor("#6366f1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Preencha o nome da categoria.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await categoryService.create({
        name: name.trim(),
        icon,
        color,
      });

      toast({
        title: "Categoria criada!",
        description: `A categoria "${name}" foi criada com sucesso.`,
      });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao criar categoria",
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
          <DialogTitle className="text-xl font-bold">Nova Categoria</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              Nome da Categoria *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Transporte, Lazer, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Icon Selector */}
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

          {/* Color Selector */}
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-10 gap-2">
              {COLOR_OPTIONS.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`aspect-square rounded-lg transition-all hover:scale-110 ${color === colorOption
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                    }`}
                  style={{ backgroundColor: colorOption }}
                  title={colorOption}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Pré-visualização</Label>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${color}20` }}
              >
                {ICON_OPTIONS.find(opt => opt.value === icon)?.label.split(" ")[0] || "📌"}
              </div>
              <span className="font-medium">{name || "Nome da categoria"}</span>
            </div>
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
                "Criar Categoria"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
