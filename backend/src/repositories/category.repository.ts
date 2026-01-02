import { Repository } from "typeorm";

import { AppDataSource } from "../database/data-source.js";
import { Category } from "../entities/category.entity.js";

type CreateCategoryPayload = Omit<Category, "id" | "createdAt" | "updatedAt">;

export class CategoryRepository {
  private get repository(): Repository<Category> {
    if (!AppDataSource.isInitialized) {
      throw new Error("Database connection is not ready");
    }

    return AppDataSource.getRepository(Category);
  }

  findAll() {
    return this.repository.find({ order: { name: "ASC" } });
  }

  findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }

  async create(payload: CreateCategoryPayload) {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  async update(category: Category) {
    return this.repository.save(category);
  }

  async delete(category: Category) {
    return this.repository.remove(category);
  }
}
