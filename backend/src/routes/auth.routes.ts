import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth, authRateLimiter } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  renewTokens,
} from "../controllers/auth.controller.js";

const router = Router();

// POST - Register new user
router.route("/signup").post(authRateLimiter, asyncHandler(registerUser));

// POST - Login user
router.route("/login").post(authRateLimiter, asyncHandler(loginUser));

// POST - Logout user
router.route("/logout").post(checkAuth, asyncHandler(logoutUser));

// POST - Renew Token
router.route("/token").post(asyncHandler(renewTokens));

// Error Handler
router.use(errorHandler);

export default router;
