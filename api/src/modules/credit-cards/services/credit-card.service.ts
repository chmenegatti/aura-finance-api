import { NotFoundError } from "../../../errors/AppError.js";
import { CreateCreditCardDto } from "../dtos/credit-card-create.dto.js";
import { UpdateCreditCardDto } from "../dtos/credit-card-update.dto.js";
import { CreditCard } from "../entities/credit-card.entity.js";
import { CreditCardRepository } from "../repositories/credit-card.repository.js";

export class CreditCardService {
  private repository = new CreditCardRepository();

  list(userId: string) {
    return this.repository.findByUser(userId);
  }

  async get(userId: string, cardId: string) {
    const card = await this.repository.findById(cardId, userId);

    if (!card) {
      throw new NotFoundError("Cartão não encontrado");
    }

    return card;
  }

  async create(userId: string, payload: CreateCreditCardDto) {
    const card = await this.repository.create({
      userId,
      name: payload.name,
      brand: payload.brand,
      lastFourDigits: payload.lastFourDigits,
      creditLimit: payload.creditLimit.toFixed(2),
      closingDay: payload.closingDay,
      dueDay: payload.dueDay,
    } as Omit<CreditCard, "id" | "createdAt" | "updatedAt" | "user" | "expenses">);

    return card;
  }

  async update(userId: string, cardId: string, payload: UpdateCreditCardDto) {
    const card = await this.get(userId, cardId);

    Object.assign(card, {
      name: payload.name ?? card.name,
      brand: payload.brand ?? card.brand,
      lastFourDigits: payload.lastFourDigits ?? card.lastFourDigits,
      creditLimit: payload.creditLimit !== undefined ? payload.creditLimit.toFixed(2) : card.creditLimit,
      closingDay: payload.closingDay ?? card.closingDay,
      dueDay: payload.dueDay ?? card.dueDay,
    });

    return this.repository.update(card);
  }

  async remove(userId: string, cardId: string) {
    const card = await this.get(userId, cardId);
    await this.repository.delete(card);
  }
}
