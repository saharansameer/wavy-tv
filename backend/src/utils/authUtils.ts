import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config/env.js";

export const getLoggedInUserInfo = (token: string) => {
  if (!token) return null;

  // Validate Refresh Token (If Exist in cookies)
  const validateToken = jwt.verify(token, REFRESH_TOKEN_SECRET);

  if (!validateToken) return null;

  return validateToken; // Return Current Logged-in User's Info
};

export const unpackUserData = (user: any) => {
  return {
    theme: user.preferences.theme,
    nsfwContent: user.preferences.nsfwContent,
    publishStatus: user.preferences.publishStatus,
    category: user.preferences.category,
    saveSearchHistory: user.preferences.saveSearchHistory,
    saveWatchHistory: user.preferences.saveWatchHistory,
    fullName: user.fullName,
    username: user.username,
    avatar: user.avatar,
    email: user.email,
  };
};
