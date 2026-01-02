import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type { Category, CategoryDTO, CategoryType } from "@/types/category";
import { mapCategory } from "./mappers";

export interface CategoryCreateRequest {
  name: string;
  icon?: string | null;
  color?: string | null;
  type: CategoryType;
}

export interface CategoryUpdateRequest {
  name?: string;
  icon?: string | null;
  color?: string | null;
  type?: CategoryType;
}

export const categoryService = {
  async list(): Promise<Category[]> {
    const { data } = await api.get<ApiResponseSuccess<{ categories: CategoryDTO[] }>>(
      "/categories",
    );

    return data.data.categories.map(mapCategory);
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<ApiResponseSuccess<CategoryDTO>>(
      `/categories/${id}`
    );
    return mapCategory(data.data);
  },

  async create(payload: CategoryCreateRequest): Promise<Category> {
    const { data } = await api.post<ApiResponseSuccess<CategoryDTO>>(
      "/categories",
      payload
    );
    return mapCategory(data.data);
  },

  async update(id: string, payload: CategoryUpdateRequest): Promise<Category> {
    const { data } = await api.put<ApiResponseSuccess<CategoryDTO>>(
      `/categories/${id}`,
      payload
    );
    return mapCategory(data.data);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
