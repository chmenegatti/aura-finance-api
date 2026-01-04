import { formatCurrency } from "@/lib/finance";
import { cn } from "@/lib/utils";
import type { CreditCard, CreditCardInvoice } from "../types/credit-card";

const CARD_COLORS: Record<string, string> = {
  nubank: "#8358ff",
  itau_black: "#111827",
  itau: "#ff7a18",
  inter: "#fb923c",
  bradesco: "#e11d48",
  santander: "#dc2626",
  mercado_pago: "#3b82f6",
  banco_pan: "#fcd34d",
  c6: "#111827",
  default: "#1e293b",
};

const getCardColor = (brand: string, name: string) => {
  const key = brand.toLowerCase().replace(/\s+/g, "_");
  if (CARD_COLORS[key]) {
    return CARD_COLORS[key];
  }

  const nameKey = name.toLowerCase().replace(/\s+/g, "_");
  return CARD_COLORS[nameKey] ?? CARD_COLORS.default;
};

interface CreditCardItemProps {
  card: CreditCard;
  invoice?: CreditCardInvoice;
  isActive?: boolean;
  onSelect?: (cardId: string) => void;
}

export function CreditCardItem({ card, invoice, isActive, onSelect }: CreditCardItemProps) {
  const color = getCardColor(card.brand, card.name);
  const spent = invoice?.total ?? 0;
  const available = Math.max(0, card.creditLimit - spent);
  const utilization = card.creditLimit > 0 ? Math.min(1, spent / card.creditLimit) : 0;
  const issuedAt = card.createdAt ? new Date(card.createdAt) : new Date();
  const expirationDate = `${String(issuedAt.getMonth() + 1).padStart(2, "0")}/${String(issuedAt.getFullYear()).slice(-2)}`;
  const upperBrand = card.brand.toUpperCase();

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect?.(card.id)}
      className={cn(
        "relative flex min-h-[16rem] w-full max-w-[22rem] flex-col rounded-[36px] border border-white/10 p-6 text-white shadow-soft-xl transition-transform duration-200",
        isActive ? "scale-105" : "hover:-translate-y-0.5",
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${color}, rgba(15,23,42,0.95))`,
      }}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)] opacity-70" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/60">{card.brand}</p>
            <p className="text-base font-semibold leading-tight">{card.name}</p>
          </div>
          <div className="text-sm font-semibold text-white/90">{upperBrand}</div>
        </div>

        <div className="mt-6 text-xs tracking-[0.35em] text-white/80">•••• •••• •••• {card.lastFourDigits}</div>

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/70">
            <span>Validade</span>
            <span className="font-semibold text-white">{expirationDate}</span>
          </div>
          <div className="text-xs uppercase tracking-wider text-white/70">Limite total</div>
          <p className="text-base font-semibold">{formatCurrency(card.creditLimit)}</p>
          <div className="flex items-center justify-between text-sm text-white/80">
            <span>Disponível</span>
            <span className="text-sm">{formatCurrency(available)}</span>
          </div>
          <div className="h-1 rounded-full bg-white/20">
            <div
              className="h-full rounded-full"
              style={{
                width: `${utilization * 100}%`,
                backgroundColor: color,
                boxShadow: `0 0 12px ${color}`,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
            <div className="flex items-center justify-between">
              <span>Fechamento</span>
              <span className="text-white">{card.closingDay}º</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Vencimento</span>
              <span className="text-white">{card.dueDay}º</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
