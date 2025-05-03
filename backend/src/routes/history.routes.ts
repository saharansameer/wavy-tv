import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  getWatchHistory,
  deleteWatchHistory,
  addVideoToWatchHistory,
  removeVideoFromWatchHistory,
  deleteSearchHistory,
} from "../controllers/history.controller.js";

const router = Router();

// Check User Auth
router.use(checkAuth);

// GET - Fetch Watch History
router.route("/").get(asyncHandler(getWatchHistory));

// DELETE - Delete Watch History
router.route("/clear").delete(asyncHandler(deleteWatchHistory));

// POST - Add Video to Watch History
router.route("/add").post(asyncHandler(addVideoToWatchHistory));

// POST - Remove Video from Watch History
router.route("/remove").post(asyncHandler(removeVideoFromWatchHistory));

// PATCH - Delete (Clear) User's Search History
router.route("/clear/search").patch(asyncHandler(deleteSearchHistory));

// Error Handler
router.use(errorHandler);

export default router;
