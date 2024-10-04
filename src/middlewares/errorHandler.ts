// src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/CustomError";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // For logging purposes
  res.status(err.status || 500).json({ message: err.message });
};
