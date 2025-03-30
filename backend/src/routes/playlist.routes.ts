import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getPlaylistByPublicId,
  updatePlaylistDetails,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

// POST - Create Playlist
router.route("/").post(checkAuth, asyncHandler(createPlaylist));

// GET - Gets Playlist
// PATCH - Update Playlist Details (i.e title, description, publishStatus)
// DELETE - Delete Playlist
router
  .route("/:playlistPublicId")
  .get(asyncHandler(getPlaylistByPublicId))
  .patch(checkAuth, asyncHandler(updatePlaylistDetails))
  .delete(checkAuth, asyncHandler(deletePlaylist));

// PATCH - Add Video to Playlist
router
  .route("/:playlistPublicId/add")
  .patch(checkAuth, asyncHandler(addVideoToPlaylist));

// PATCH - Remove Video from Playlist
router
  .route("/:playlistPublicId/remove")
  .patch(checkAuth, asyncHandler(removeVideoFromPlaylist));

// Error Handler
router.use(errorHandler);

export default router;
