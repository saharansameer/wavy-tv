import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import { HTTP_STATUS } from "../utils/constants.js";

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
      message: "Access Token expired",
    });
  }

  req.user = validateToken;

  next();
};
