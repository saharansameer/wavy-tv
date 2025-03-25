import { Request, Response, NextFunction } from "express";

export const asyncHandler = (requestHandler: Controller) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await requestHandler(req, res);
    } catch (err: unknown) {
      next(err);
    }
  };
};
