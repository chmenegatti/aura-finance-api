import { instanceToPlain } from "class-transformer";
import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../types/authenticated-request.js";
import { UserService } from "../services/user.service.js";

const userService = new UserService();

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.getById(req.user?.id ?? "");

    return res.status(200).json({
      status: "success",
      data: {
        user: instanceToPlain(user),
      },
    });
  } catch (error) {
    next(error);
  }
};
