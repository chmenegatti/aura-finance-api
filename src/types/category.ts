// Formato vindo do backend (OpenAPI)
export type CategoryType = "INCOMING" | "OUTCOMING";

export interface CategoryDTO {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  userId: string;
  type: CategoryType;
}

// Formato utilizado pela UI (normalizado)
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  userId?: string;
}
