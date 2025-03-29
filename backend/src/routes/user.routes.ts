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
} from "../controllers/user.controller.js";
import { authRateLimiter } from "../middlewares/auth.middleware.js";

const router = Router();

// Check User Auth
router.use(checkAuth);

// GET - Get User details
// PATCH - Update User names (i.e fullName and username)
router
  .route("/")
  .get(asyncHandler(getCurrentUser))
  .patch(authRateLimiter, asyncHandler(updateUserNames));

// PATCH - Update User email
router
  .route("/security/email")
  .patch(authRateLimiter, asyncHandler(updateUserEmail));

// PATCH - Update User password
router
  .route("/security/password")
  .patch(authRateLimiter, asyncHandler(updateUserPassword));

// PATCH - Toggle creatorMode (i.e true or false)
router
  .route("/privacy/creator")
  .patch(authRateLimiter, asyncHandler(toggleCreatorMode));

// Error Handler
router.use(errorHandler);

export default router;
