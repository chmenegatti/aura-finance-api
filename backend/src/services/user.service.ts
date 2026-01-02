import { NotFoundError } from "../errors/AppError.js";
import { User } from "../entities/user.entity.js";
import { UserRepository } from "../repositories/user.repository.js";

export class UserService {
  private userRepository = new UserRepository();

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
