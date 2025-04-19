import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import {
  getCurrentUser,
  updateUserNames,
  updateUserEmail,
  updateUserPassword,
  toggleCreatorMode,
  updateUserPreferences,
  toggleSearchAndWatchHistory,
  deleteSearchAndWatchHistory,
  updateUserAbout,
} from "../controllers/user.controller.js";
import { authRateLimiter } from "../middlewares/auth.middleware.js";

const router = Router();

// Check User Auth
router.use(checkAuth);

// GET - Get User details
router.route("/").get(asyncHandler(getCurrentUser));

// PATCH - Update User names (i.e fullName and username)
router
  .route("/update/names")
  .patch(authRateLimiter, asyncHandler(updateUserNames));

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

// PATCH - Delete (Clear) User's Search and Watch History
router
  .route("/delete/history")
  .patch(asyncHandler(deleteSearchAndWatchHistory));

// PATCH - Update User's about (bio)
router.route("/update/about").patch(asyncHandler(updateUserAbout));

// Error Handler
router.use(errorHandler);

export default router;
