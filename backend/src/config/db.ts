import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI as string, {
      dbName: "wavytvdb",
    });
    console.log("MongoDB Connected");
  } catch (err: unknown) {
    console.error(`MongoDB Connection Error: ${err}`);
    process.exit(1);
  }
};

export default connectDB;
