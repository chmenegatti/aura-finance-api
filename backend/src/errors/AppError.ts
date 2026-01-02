export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly details: string[];

  constructor(message: string, statusCode = 500, details: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details: string[] = []) {
    super(message, 404, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details: string[] = []) {
    super(message, 401, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details: string[] = []) {
    super(message, 409, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details: string[] = []) {
    super(message, 400, details);
  }
}
