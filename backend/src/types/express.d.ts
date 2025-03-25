import { Request, Response, NextFunction } from "express";

declare global {
  type Controller = (req: Request, res: Response) => Promise<Response>;

  type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void> | void;

  type ErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}

export {};
