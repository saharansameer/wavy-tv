import { Response } from "express";

export type ToggleEntityType = (
  entity: string,
  entityId: string,
  userId: string,
  res: Response
) => Promise<Response>;

export type VoteServiceType = (
  entity: string,
  entityId: string,
  userId: string
) => Promise<boolean>;
