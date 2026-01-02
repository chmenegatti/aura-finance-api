import type { Category, CategoryDTO } from "@/types/category";
import type { Transaction, TransactionDTO, TransactionType } from "@/types/transaction";

const DEFAULT_CATEGORY_COLOR = "hsl(var(--muted-foreground))";
const DEFAULT_CATEGORY_ICON = "🏷️";

export function mapCategory(dto: CategoryDTO): Category {
  return {
    id: dto.id,
    name: dto.name,
    icon: dto.icon ?? DEFAULT_CATEGORY_ICON,
    color: dto.color ?? DEFAULT_CATEGORY_COLOR,
    userId: dto.userId,
    type: dto.type,
  };
}

function mapTransactionType(apiType: TransactionDTO["type"]): TransactionType {
  return apiType === "INCOME" ? "income" : "expense";
}

export function mapTransaction(dto: TransactionDTO): Transaction {
  return {
    id: dto.id,
    description: dto.description,
    amount: Number(dto.amount),
    type: mapTransactionType(dto.type),
    category: mapCategory(dto.category),
    date: new Date(dto.date),
    paymentMethod: dto.paymentMethod,
    isRecurring: dto.isRecurring,
    receiptUrl: dto.receiptUrl,
    receipt: dto.receipt,
  };
}

export function mapTransactions(dtos: TransactionDTO[]): Transaction[] {
  return dtos.map(mapTransaction);
}
