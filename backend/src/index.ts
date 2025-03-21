import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config({
  path: "../.env",
});

const PORT = process.env.PORT || 4040;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`wavytv-backend is listening Port: ${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error(`MongoDB Connection Error: ${err}`);
  });
