import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: DB_NAME
    });
    console.log("MongoDB Connected");
  } catch (err: unknown) {
    console.error(`MongoDB Connection Error: ${err}`);
    process.exit(1);
  }
};

export default connectDB;
