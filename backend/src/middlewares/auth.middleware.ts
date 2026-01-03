import jsonwebtoken from "jsonwebtoken";
import { NextFunction, Response } from "express";

import { UserRepository } from "../modules/users/repositories/user.repository.js";
import { UnauthorizedError } from "../errors/AppError.js";
import { verifyJwt } from "../utils/jwt.js";
import { AuthenticatedRequest } from "../types/authenticated-request.js";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw new UnauthorizedError("Missing authorization header");
    }

    const [scheme, token] = header.split(" ");

    if (!token || scheme !== "Bearer") {
      throw new UnauthorizedError("Invalid authorization format");
    }

    const payload = verifyJwt<{ userId: string }>(token);
    const user = await new UserRepository().findById(payload.userId);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jsonwebtoken.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid token"));
      return;
    }

    next(error);
  }
};
