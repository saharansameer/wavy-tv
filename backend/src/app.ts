import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { SIZE_LIMIT } from "./utils/constants.js";
import { FRONTEND_URL } from "./config/env.js";
import { undefinedRoutesHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: [FRONTEND_URL as string],
    credentials: true,
  })
);

app.use(express.json({ limit: SIZE_LIMIT }));
app.use(cookieParser());

// Routes import
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import followRoutes from "./routes/follow.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import voteRoutes from "./routes/vote.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import searchRoutes from "./routes/search.routes.js";
import historyRoutes from "./routes/history.routes.js";

// Routes declaration
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/video", videoRoutes);
app.use("/api/v1/follow", followRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/vote", voteRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/history", historyRoutes);

// Handle Undefined Routes
app.use(undefinedRoutesHandler);

export default app;
