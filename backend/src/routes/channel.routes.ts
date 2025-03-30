import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { getChannelProfile } from "../controllers/channel.controller.js";

const router = Router();

// Error Handler
router.use(errorHandler);

// GET - Fetch channel profile
router.route("/:username").get(asyncHandler(getChannelProfile));

export default router;
