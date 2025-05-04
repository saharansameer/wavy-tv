import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import { HTTP_STATUS, RESPONSE_MESSAGE } from "../utils/constants.js";

export const checkAuth: Middleware = (req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new ApiError({
      status: HTTP_STATUS.NOT_FOUND,
      message: RESPONSE_MESSAGE.COOKIES.NOT_FOUND,
    });
  }

  try {
    const validateToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = validateToken;
  } catch {
    throw new ApiError({
      status: HTTP_STATUS.FORBIDDEN,
      message: RESPONSE_MESSAGE.COOKIES.ACCESS_TOKEN_EXPIRED,
    });
  }

  next();
};
