import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  getAllVideos,
  getVideoByPublicId,
  updateVideoDetails,
  deleteVideo,
  uploadVideo,
} from "../controllers/video.controller.js";

const router = Router();

// GET - Fetch all videos
router.route("/").get(asyncHandler(getAllVideos));

// GET - Fetch video by publicId
// PATCH - Update video details (i.e title, description, publishStatus) by publicId
// DELETE - Fetch video by publicId
router
  .route("/:videoPublicId")
  .get(asyncHandler(getVideoByPublicId))
  .patch(checkAuth, asyncHandler(updateVideoDetails))
  .delete(checkAuth, asyncHandler(deleteVideo));

// POST - Upload Video
router.route("/upload").post(checkAuth, asyncHandler(uploadVideo));

// Error Handler
router.use(errorHandler);

export default router;
