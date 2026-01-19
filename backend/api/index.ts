export const config = {
  runtime: "nodejs",
};

import app from "../src/app.js";
import connectDB from "../src/config/db.js";

await connectDB();

export default app;
