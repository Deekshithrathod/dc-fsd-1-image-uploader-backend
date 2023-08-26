import { config } from "dotenv";
import mongoose from "mongoose";
config();

export const dbConnection = mongoose.createConnection(
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/",
  {
    dbName: "imageUploader",
  }
);
