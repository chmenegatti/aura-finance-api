import { UserRepository } from "../../modules/users/repositories/user.repository.js";

import type { CreateUserPayload, DatabaseProvider, UserProvider } from "./types.js";

class TypeormUserProvider implements UserProvider {
  private repository = new UserRepository();

  findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  findById(id: string) {
    return this.repository.findById(id);
  }

  async create(payload: CreateUserPayload) {
    return this.repository.create(payload);
  }
}

export function typeOrmProviderFactory(): DatabaseProvider {
  return {
    users: new TypeormUserProvider(),
  };
}
