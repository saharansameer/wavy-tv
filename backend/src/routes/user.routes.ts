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
  updateUserPofileImage,
} from "../controllers/user.controller.js";

const router = Router();

// GET - Ger User by username
router.route("/:username").get(asyncHandler(getUserByUsername));

// Check User Auth
router.use(checkAuth);

// GET - Get User details
router.route("/").get(asyncHandler(getCurrentUser));

// PATCH - Update User Info (i.e fullName, username, about)
router.route("/update/info").patch(asyncHandler(updateUserInfo));

// PATCH - Update User's images (i.e avatar and coverImage)
router.route("/update/image").patch(asyncHandler(updateUserPofileImage));

// PATCH - Update User email
router.route("/update/email").patch(asyncHandler(updateUserEmail));

// PATCH - Update User password
router.route("/update/password").patch(asyncHandler(updateUserPassword));

// PATCH - Toggle creatorMode (i.e true or false)
router.route("/toggle/creatorMode").patch(asyncHandler(toggleCreatorMode));

// PATCH - Update User's preferences
router.route("/update/preferences").patch(asyncHandler(updateUserPreferences));

// PATCH - Update User's Search and Watch History preferences
router
  .route("/toggle/history")
  .patch(asyncHandler(toggleSearchAndWatchHistory));

// Error Handler
router.use(errorHandler);

export default router;
