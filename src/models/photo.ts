import { Schema } from "mongoose";
import { dbConnection } from "../db/db";

export interface IPhoto {
  originalName: string;
  date: Date;
  publicId: string;
  name: string;
  accessCount: number;
}

// name:
// hash:
// uploadedByUser
// accessCount:
// accessList

const photoSchema = new Schema<IPhoto>({
  originalName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  accessCount: {
    type: Number,
    default: 1,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  publicId: {
    type: String,
    required: true,
  },
});

export const Photo = dbConnection.model<IPhoto>("Photo", photoSchema);
