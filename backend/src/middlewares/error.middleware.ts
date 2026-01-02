import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.util";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(errorResponse(err.message));
  }

  console.error("Unexpected Error:", err);

  return res
    .status(500)
    .json(errorResponse("Internal server error"));
};
