import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import {
  getUserByUsername,
  getCurrentUser,
  updateUserInfo,
  updateUserEmail,
  updateUserPassword,
  toggleCreatorMode,
  updateUserPreferences,
  toggleSearchAndWatchHistory,
  updateUserAbout,
} from "../controllers/user.controller.js";
import { authRateLimiter } from "../middlewares/auth.middleware.js";

const router = Router();

// GET - Ger User by username
router.route("/:username").get(asyncHandler(getUserByUsername));

// Check User Auth
router.use(checkAuth);

// GET - Get User details
router.route("/").get(asyncHandler(getCurrentUser));

// PATCH - Update User Info (i.e fullName, username, about)
router
  .route("/update/info")
  .patch(authRateLimiter, asyncHandler(updateUserInfo));

// PATCH - Update User email
router
  .route("/update/email")
  .patch(authRateLimiter, asyncHandler(updateUserEmail));

// PATCH - Update User password
router
  .route("/update/password")
  .patch(authRateLimiter, asyncHandler(updateUserPassword));

// PATCH - Toggle creatorMode (i.e true or false)
router
  .route("/toggle/creatorMode")
  .patch(authRateLimiter, asyncHandler(toggleCreatorMode));

// PATCH - Update User's preferences
router.route("/update/preferences").patch(asyncHandler(updateUserPreferences));

// PATCH - Update User's Search and Watch History preferences
router
  .route("/toggle/history")
  .patch(asyncHandler(toggleSearchAndWatchHistory));

// PATCH - Update User's about (bio)
router.route("/update/about").patch(asyncHandler(updateUserAbout));

// Error Handler
router.use(errorHandler);

export default router;
