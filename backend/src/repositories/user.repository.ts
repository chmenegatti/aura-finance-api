import { Repository } from "typeorm";

import { AppDataSource } from "../database/data-source.js";
import { User } from "../entities/user.entity.js";

type CreateUserPayload = Omit<User, "id" | "createdAt" | "updatedAt">;

export class UserRepository {
  private get repository(): Repository<User> {
    if (!AppDataSource.isInitialized) {
      throw new Error("Database connection is not ready");
    }

    return AppDataSource.getRepository(User);
  }

  findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async create(payload: CreateUserPayload) {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }
}
