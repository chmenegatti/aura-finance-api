import bcrypt from "bcrypt";

import { ConflictError, UnauthorizedError } from "../errors/AppError.js";
import { UserRepository } from "../repositories/user.repository.js";
import { LoginUserDto } from "../dtos/auth-login.dto.js";
import { RegisterUserDto } from "../dtos/auth-register.dto.js";
import { signJwt } from "../utils/jwt.js";

const SALT_ROUNDS = 10;

export class AuthService {
  private userRepository = new UserRepository();

  async register(payload: RegisterUserDto) {
    const existingUser = await this.userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);

    const user = await this.userRepository.create({
      name: payload.name,
      email: payload.email,
      passwordHash,
    });

    const token = signJwt({ userId: user.id, email: user.email });

    return {
      user,
      token,
    };
  }

  async login(payload: LoginUserDto) {
    const user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = signJwt({ userId: user.id, email: user.email });

    return { token };
  }
}
