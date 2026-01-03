import { instanceToPlain } from "class-transformer";
import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/auth.service.js";
import { LoginUserDto } from "../dtos/auth-login.dto.js";
import { RegisterUserDto } from "../dtos/auth-register.dto.js";

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, token } = await authService.register(req.body as RegisterUserDto);

    return res.status(201).json({
      status: "success",
      data: {
        user: instanceToPlain(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = await authService.login(req.body as LoginUserDto);
    return res.status(200).json({
      status: "success",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
