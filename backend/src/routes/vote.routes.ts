import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  toggleVideoVotes,
  togglePostVotes,
  toggleCommentVotes,
} from "../controllers/vote.controller.js";

const router = Router();

// Check User Auth
router.use(checkAuth);

// POST - Toggle Upvote and Downvote on Video
router.route("/video").post(asyncHandler(toggleVideoVotes));

// POST - Toggle Upvote and Downvote on Post
router.route("/post").post(asyncHandler(togglePostVotes));

// POST - Toggle Upvote and Downvote on Comment
router.route("/comment").post(asyncHandler(toggleCommentVotes));

// Error Handler
router.use(errorHandler);

export default router;
