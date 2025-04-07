import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { getSearchResults } from "../controllers/search.controller.js";

const router = Router();

// GET - Search Results for video, channel and playlist
router.route("/").get(asyncHandler(getSearchResults));

// Error Handler
router.use(errorHandler);

export default router;
