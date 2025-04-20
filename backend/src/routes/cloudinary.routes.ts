import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import { getCloudinarySignature } from "../controllers/cloudinary.controller.js";

const router = Router();

router.route("/signature").get(asyncHandler(getCloudinarySignature));

// Error Handler
router.use(errorHandler);

export default router;
