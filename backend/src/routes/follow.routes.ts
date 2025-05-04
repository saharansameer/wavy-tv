import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  toggleFollow,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";

const router = Router();

// Check User Auth
router.use(checkAuth);

// POST - Toggle follow (i.e Follow or Unfollow a user)
router.route("/:username").post(asyncHandler(toggleFollow));

// GET - Fetch List of Followers of a user
router.route("/follower/:username").get(asyncHandler(getFollowers));

// GET - Fetch List of Following of a user
router.route("/following/:username").get(asyncHandler(getFollowing));

// Error Handler
router.use(errorHandler);

export default router;
