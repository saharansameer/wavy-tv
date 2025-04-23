import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth, authRateLimiter } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  renewTokens,
  verifyAccessToken,
} from "../controllers/auth.controller.js";

const router = Router();

// POST - Register new user
router.route("/signup").post(authRateLimiter, asyncHandler(registerUser));

// POST - Login user
router.route("/login").post(authRateLimiter, asyncHandler(loginUser));

// POST - Logout user
router.route("/logout").get(checkAuth, asyncHandler(logoutUser));

// POST - Renew Token
router.route("/token/new").get(asyncHandler(renewTokens));

// GET - Verify Access Token
router.route("/token/verify").get(checkAuth, asyncHandler(verifyAccessToken));

// Error Handler
router.use(errorHandler);

export default router;
