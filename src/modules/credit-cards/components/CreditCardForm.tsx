import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { ApiError } from "@/types/api";
import { creditCardsService } from "../services/creditCardsService";
import type { CreateCreditCardRequest } from "../types/credit-card";

interface CreditCardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DEFAULT_VALUES: CreateCreditCardRequest = {
  name: "",
  brand: "",
  lastFourDigits: "",
  creditLimit: 0,
  closingDay: 1,
  dueDay: 1,
};

export function CreditCardForm({ open, onOpenChange, onSuccess }: CreditCardFormProps) {
  const { toast } = useToast();
  const [formValue, setFormValue] = React.useState<CreateCreditCardRequest>(DEFAULT_VALUES);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setFormValue(DEFAULT_VALUES);
    }
  }, [open]);

  const handleChange = (field: keyof CreateCreditCardRequest, value: string | number) => {
    setFormValue((prev) => ({
      ...prev,
      [field]: typeof value === "number" ? value : value.trimStart(),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !formValue.name ||
      !formValue.brand ||
      formValue.lastFourDigits.length !== 4 ||
      formValue.creditLimit <= 0 ||
      formValue.closingDay < 1 ||
      formValue.closingDay > 31 ||
      formValue.dueDay < 1 ||
      formValue.dueDay > 31
    ) {
      toast({
        title: "Campos inválidos",
        description: "Preencha o formulário corretamente.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await creditCardsService.createCard(formValue);
      toast({
        title: "Cartão cadastrado",
        description: "O cartão foi adicionado ao seu portfólio.",
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      const apiError = error as ApiError;
      toast({
        title: "Erro ao cadastrar",
        description: apiError.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar cartão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="card-name">Nome</Label>
            <Input
              id="card-name"
              value={formValue.name}
              onChange={(event) => handleChange("name", event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="card-brand">Bandeira</Label>
            <Input
              id="card-brand"
              value={formValue.brand}
              onChange={(event) => handleChange("brand", event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="card-last-four">Últimos 4 dígitos</Label>
              <Input
                id="card-last-four"
                maxLength={4}
                value={formValue.lastFourDigits}
                onChange={(event) => handleChange("lastFourDigits", event.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="card-credit-limit">Limite total (R$)</Label>
              <Input
                id="card-credit-limit"
                type="number"
                step="0.01"
                min="0"
                value={formValue.creditLimit}
                onChange={(event) => handleChange("creditLimit", Number(event.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="card-closing-day">Dia de fechamento</Label>
              <Input
                id="card-closing-day"
                type="number"
                min="1"
                max="31"
                value={formValue.closingDay}
                onChange={(event) => handleChange("closingDay", Number(event.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="card-due-day">Dia de vencimento</Label>
              <Input
                id="card-due-day"
                type="number"
                min="1"
                max="31"
                value={formValue.dueDay}
                onChange={(event) => handleChange("dueDay", Number(event.target.value))}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="income" type="submit" disabled={isSubmitting}>
              Cadastrar cartão
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
