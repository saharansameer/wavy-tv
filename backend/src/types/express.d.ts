import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

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

  type ToggleEntityType = (
    entity: string,
    entityId: string,
    userId: string,
    res: Response
  ) => Promise<Response>;

  type VoteServiceType = (
    entity: string,
    entityId: string,
    userId: string,
  ) => Promise<boolean>;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      _id: Types.ObjectId;
    };
  }
}

export {};
