import connectDB from "./config/db.js";
import app from "./app.js";
import { PORT } from "./config/env.js";

connectDB()
  .then(() => {
    app.listen(PORT || 4040, () => {
      console.log(`wavytv-backend is listening Port: ${PORT || 4040}`);
    });
  })
  .catch((err: unknown) => {
    console.error(`MongoDB Connection Error: ${err}`);
  });
