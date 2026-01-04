import type { User } from "../../modules/users/entities/user.entity.js";

export type CreateUserPayload = Omit<User, "id" | "createdAt" | "updatedAt">;

export interface UserProvider {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(payload: CreateUserPayload): Promise<User>;
}

export interface DatabaseProvider {
  users: UserProvider;
}
