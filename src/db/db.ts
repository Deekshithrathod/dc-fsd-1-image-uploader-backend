import mongoose from "mongoose";

export const dbConnection = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/",
  {
    dbName: "imageUploader",
  }
);
