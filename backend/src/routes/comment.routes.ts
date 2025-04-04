import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  addCommentOnVideo,
  addCommentOnPost,
  addReplyComment,
  updateCommentById,
  deleteCommentById,
  getEntityComments,
} from "../controllers/comment.controller.js";

const router = Router();

// GET - Fetch comments of video/post/comment
router.route("/").get(asyncHandler(getEntityComments));

// Check User Auth (For all following routes)
router.use(checkAuth);

// POST - Add Comment on video
router.route("/video").post(asyncHandler(addCommentOnVideo));

// POST - Add Comment on post
router.route("/post").post(asyncHandler(addCommentOnPost));

// POST - Add Reply Comment on comment
router.route("/reply").post(asyncHandler(addReplyComment));

// PATCH - Update Comment by id
router.route("/update").patch(asyncHandler(updateCommentById));

// DELETE - Delete Comment by id
router.route("/delete").delete(asyncHandler(deleteCommentById));

// Error Handler
router.use(errorHandler);

export default router;
