import { Schema, model, Document } from "mongoose";

enum PublishStatus {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
}

interface VideoObject extends Document {
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: string;
  videoFile: string;
  videoFilePublicId: string;
  thumbnail: string;
  thumbnailPublicId: string;
  publishStatus: PublishStatus;
  usersWithPrivateAccess: Schema.Types.ObjectId[];
}

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      match: [
        /[a-zA-Z0-9]/,
        "Title can not be empty and must contain a valid letter",
      ],
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
    },
    views: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    videoFile: {
      type: String,
    },
    videoFilePublicId: {
      type: String,
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
      default: PublishStatus.PUBLIC,
    },
    usersWithPrivateAccess: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Video = model<VideoObject>("Video", videoSchema);
