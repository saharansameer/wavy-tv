import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { SIZE_LIMIT } from "./utils/constants.js";
import { FRONTEND_URL, LOCAL_HOST } from "./config/env.js";
import { undefinedRoutesHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: [FRONTEND_URL as string, LOCAL_HOST as string],
    credentials: true,
  })
);

app.use(express.json({ limit: SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: SIZE_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

// Routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// Handle Undefined Routes
app.use(undefinedRoutesHandler);

export default app;
