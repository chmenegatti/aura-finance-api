import { NotFoundError } from "../../../errors/AppError.js";
import { User } from "../entities/user.entity.js";
import { databaseProvider } from "../../../database/providers/index.js";

export class UserService {
  private userProvider = databaseProvider.users;

  async getById(id: string): Promise<User> {
    const user = await this.userProvider.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
