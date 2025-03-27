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

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      publicId: string;
    };
  }
}

export {};
