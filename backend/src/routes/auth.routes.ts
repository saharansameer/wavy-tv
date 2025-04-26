import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth, authRateLimiter } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  renewTokens,
  deleteTokensFromCookies,
  existingEmailAndUsername,
} from "../controllers/auth.controller.js";

const router = Router();

// POST - Register new user
router.route("/signup").post(authRateLimiter, asyncHandler(registerUser));

// POST - Login user
router.route("/login").post(authRateLimiter, asyncHandler(loginUser));

// GET - Logout user
router.route("/logout").get(checkAuth, asyncHandler(logoutUser));

// GET - Renew Token
router.route("/token/new").get(asyncHandler(renewTokens));

// GET - Remove Token
router.route("/token/delete").get(asyncHandler(deleteTokensFromCookies));

// POST - Existing Email and Username
router.route("/exist").post(asyncHandler(existingEmailAndUsername));

// Error Handler
router.use(errorHandler);

export default router;
