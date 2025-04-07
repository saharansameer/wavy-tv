import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config/env.js";

export const getLoggedInUserInfo = (token: string) => {
  if (!token) return null;

  // Validate Refresh Token (If Exist in cookies)
  const validateToken = jwt.verify(token, REFRESH_TOKEN_SECRET);

  if (!validateToken) return null;

  return validateToken; // Return Current Logged-in User's Info
};
