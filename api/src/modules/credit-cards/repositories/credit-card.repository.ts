import { Repository } from "typeorm";

import { AppDataSource } from "../../../database/data-source.js";
import { CreditCard } from "../entities/credit-card.entity.js";

type CreateCreditCardPayload = Omit<CreditCard, "id" | "createdAt" | "updatedAt" | "user" | "expenses">;

export class CreditCardRepository {
  private get repository(): Repository<CreditCard> {
    if (!AppDataSource.isInitialized) {
      throw new Error("Database connection is not ready");
    }

    return AppDataSource.getRepository(CreditCard);
  }

  findByUser(userId: string) {
    return this.repository.find({ where: { userId } });
  }

  findById(id: string, userId: string) {
    return this.repository.findOne({ where: { id, userId } });
  }

  async create(payload: CreateCreditCardPayload) {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  async update(card: CreditCard) {
    return this.repository.save(card);
  }

  async delete(card: CreditCard) {
    return this.repository.remove(card);
  }
}
