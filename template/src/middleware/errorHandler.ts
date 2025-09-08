import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong" });
}
