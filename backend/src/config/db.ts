import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";

async function connectDB() {
  try {
    if (!global._mongoose) {
      global._mongoose = { conn: null, promise: null };
    }

    const cached = global._mongoose;

    if (cached.conn) {
      console.log("MongoDB: using cached connection");
      return global._mongoose.conn;
    }

    if (!cached.promise) {
      console.log("MongoDB: creating new connection...");
      global._mongoose.promise = mongoose.connect(MONGO_URI as string, {
        dbName: "wavytvdb",
      });
    }

    cached.conn = await cached.promise;
    console.log("MongoDB: connected");
    return cached.conn;
    // --
  } catch (err: unknown) {
    console.error(`MongoDB Connection Error: ${err}`);
    process.exit(1);
  }
}

export default connectDB;
