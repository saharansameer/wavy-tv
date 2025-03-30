import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config/env.js";
import { Types } from "mongoose";

export const getLoggedInUserId = (token: string): Types.ObjectId | null => {
  if (!token) return null;

  const validateToken = jwt.verify(token, REFRESH_TOKEN_SECRET);

  if (!validateToken) return null;

  return new Types.ObjectId(String(validateToken?._id));
};
