import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { SIZE_LIMIT } from "./utils/constants.js";
import { FRONTEND_URL, LOCAL_HOST } from "./config/env.js";

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

export default app;
