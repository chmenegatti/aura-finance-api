import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, RequestHandler, Response } from "express";

import { BadRequestError } from "../errors/AppError.js";

export const validationMiddleware = (
  type: ClassConstructor<unknown>,
  property: "body" | "params" | "query" = "body",
): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const instance = plainToInstance(type, req[property], { excludeExtraneousValues: false });
    const errors = await validate(instance as object, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      const details = errors.flatMap((error) => Object.values(error.constraints ?? {}));
      next(new BadRequestError("Validation failed", details));
      return;
    }

    req[property] = instance;
    next();
  };
};
