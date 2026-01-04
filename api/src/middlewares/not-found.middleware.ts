import { NextFunction, Request, Response } from "express";

import { NotFoundError } from "../errors/AppError.js";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError("Route not found"));
};
