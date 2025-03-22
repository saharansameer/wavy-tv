import { Request, Response, NextFunction } from "express";

export type Controller = (req: Request, res: Response) => Promise<void>;

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type ErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
