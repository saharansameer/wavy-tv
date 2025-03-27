import mongoose, { Document, Schema } from "mongoose";

enum PublishStatus {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
}

interface PlaylistObject extends Document {
  publicId: string;
  title: string;
  description?: string;
  owner: Schema.Types.ObjectId;
  publishStatus: PublishStatus;
  collaborators: Schema.Types.ObjectId[];
  videos: Schema.Types.ObjectId[];
}

const playlistSchema = new Schema(
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publishStatus: {
      type: String,
      enum: Object.values(PublishStatus),
      default: PublishStatus.PRIVATE,
    },
    collaborators: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    videos: {
      type: [Schema.Types.ObjectId],
      ref: "Video",
      default: [],
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model<PlaylistObject>(
  "Playlist",
  playlistSchema
);
