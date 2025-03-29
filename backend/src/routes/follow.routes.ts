import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  toggleFollow,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";
import { authRateLimiter } from "../middlewares/auth.middleware.js";

const router = Router();

// Check User Auth
router.use(checkAuth);

// POST - Toggle follow (i.e Follow or Unfollow a user)
router.route("/:username").post(authRateLimiter, asyncHandler(toggleFollow));

// GET - Fetch Followers of a user
router
  .route("/follower/:username")
  .get(authRateLimiter, asyncHandler(getFollowers));

// GET - Fetch Following of a user
router
  .route("/following/:username")
  .get(authRateLimiter, asyncHandler(getFollowing));

// Error Handler
router.use(errorHandler);

export default router;
