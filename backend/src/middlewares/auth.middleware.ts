import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";
import rateLimit from "express-rate-limit";
import { MAX_RATE_LIMIT } from "../config/env.js";

export const checkAuth: Middleware = (req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Token not found, User is not logged-in",
    });
  }

  const validateToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
  if (!validateToken) {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: RESPONSE_MESSAGE.COOKIES.ACCESS_TOKEN_EXPIRED,
    });
  }

  req.user = validateToken;

  next();
};

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(MAX_RATE_LIMIT),
  standardHeaders: "draft-8",
  handler: (_req, _res, _next): Middleware => {
    throw new ApiError({
      status: HTTP_STATUS.BAD_REQUEST,
      message: "Too many requests, please try again later.",
    });
  },
});
