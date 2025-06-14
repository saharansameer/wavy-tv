import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  createPost,
  updatePost,
  deletePost,
  getPostByPublicId,
  getAllPosts,
} from "../controllers/post.controller.js";

const router = Router();

// GET - Fetch All Posts
// POST - Create new post
router
  .route("/")
  .get(asyncHandler(getAllPosts))
  .post(checkAuth, asyncHandler(createPost));

// GET - Fetch Post by publicId
// PATCH - Update Post
// DELETE - Delete Post
router
  .route("/:postPublicId")
  .get(asyncHandler(getPostByPublicId))
  .patch(checkAuth, asyncHandler(updatePost))
  .delete(checkAuth, asyncHandler(deletePost));

// Error Handler
router.use(errorHandler);

export default router;
