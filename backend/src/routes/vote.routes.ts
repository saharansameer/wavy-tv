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

// GET - Toggle Upvote and Downvote on Video
router.route("/video").get(asyncHandler(toggleVideoVotes));

// GET - Toggle Upvote and Downvote on Post
router.route("/post").get(asyncHandler(togglePostVotes));

// GET - Toggle Upvote and Downvote on Comment
router.route("/comment").get(asyncHandler(toggleCommentVotes));

// Error Handler
router.use(errorHandler);

export default router;
