import { Response } from "express";

export type SearchUtility = (
  searchQuery: string,
  userInfo: {
    id: Types.ObjectId;
    preferences: {
      theme: string;
      nsfwContent: string;
    };
  },
  options: {
    page: number;
    limit: number;
  },
  res: Response
) => Promise<Response>;
