import { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError.js";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      details: err.details,
    });
    return;
  }

  const error = err instanceof Error ? err : new Error("Internal server error");
  console.error(error);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
    details: [],
  });
};
