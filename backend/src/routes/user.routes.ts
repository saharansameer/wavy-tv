import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { errorHandler } from "../middlewares/error.middleware.js";
import {
  getCurrentUser,
  updateUserNames,
  updateUserEmail,
  updateUserPassword,
  toggleCreaterMode,
} from "../controllers/user.controller.js";

const router = Router();

// Check User Auth
router.use(asyncHandler(checkAuth));

// GET - Get User details
// PATCH - Update User names (i.e fullName and username)
router
  .route("/")
  .get(asyncHandler(getCurrentUser))
  .patch(asyncHandler(updateUserNames));

// PATCH - Update User email
router.route("/security/email").patch(asyncHandler(updateUserEmail));

// PATCH - Update User password
router.route("/security/password").patch(asyncHandler(updateUserPassword));

// PATCH - Toggle createrMode (i.e true or false)
router.route("/privacy/creator").patch(asyncHandler(toggleCreaterMode));

// Error Handler
router.use(errorHandler);

export default router;
