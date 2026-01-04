import { NotFoundError } from "../../../errors/AppError.js";
import { Category } from "../entities/category.entity.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { CreateCategoryDto } from "../dtos/category-create.dto.js";
import { UpdateCategoryDto } from "../dtos/category-update.dto.js";

export class CategoryService {
  private categoryRepository = new CategoryRepository();

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  async create(payload: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(payload);
  }

  async update(id: string, payload: UpdateCategoryDto): Promise<Category> {
    const category = await this.getById(id);

    Object.assign(category, payload);

    return this.categoryRepository.update(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.getById(id);
    await this.categoryRepository.delete(category);
  }
}
