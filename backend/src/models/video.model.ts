import { Schema, model, Document } from "mongoose";

enum PublishStatus {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
}

interface VideoObject extends Document {
  publicId: string;
  title: string;
  description?: string;
  duration: number;
  views: number;
  owner: string;
  videoFile: string;
  videoFilePublicId: string;
  thumbnail?: string;
  thumbnailPublicId?: string;
  publishStatus: PublishStatus;
}

const videoSchema = new Schema(
  {
    publicId: {
      type: String,
      required: [true, "publicId is required"],
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      match: [
        /[a-zA-Z0-9]/,
        "Title can not be empty and must contain a valid letter",
      ],
      index: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoFile: {
      type: String,
      required: true,
    },
    videoFilePublicId: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    thumbnailPublicId: {
      type: String,
    },
    publishStatus: {
      type: String,
      enum: Object.values(PublishStatus),
      required: true,
      default: PublishStatus.PUBLIC,
    },
  },
  { timestamps: true }
);

export const Video = model<VideoObject>("Video", videoSchema);
