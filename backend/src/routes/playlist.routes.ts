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

// GET - Gets Playlist by publicId
router.route("/:playlistPublicId").get(asyncHandler(getPlaylistByPublicId));

// Check User Auth (For all following routes)
router.use(checkAuth);

// PATCH - Update Playlist Details (i.e title, description, publishStatus)
// DELETE - Delete Playlist
router
  .route("/:playlistPublicId")
  .patch(asyncHandler(updatePlaylistDetails))
  .delete(asyncHandler(deletePlaylist));

// PATCH - Add Video to Playlist
router
  .route("/:playlistPublicId/add")
  .patch(asyncHandler(addVideoToPlaylist));

// PATCH - Remove Video from Playlist
router
  .route("/:playlistPublicId/remove")
  .patch(asyncHandler(removeVideoFromPlaylist));

// Error Handler
router.use(errorHandler);

export default router;
