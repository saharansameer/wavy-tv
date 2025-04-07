import mongoose, { AggregatePaginateModel, Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

enum PublishStatus {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
}

interface PlaylistDocument extends Document {
  publicId: string;
  title: string;
  description?: string;
  owner: Schema.Types.ObjectId;
  publishStatus: PublishStatus;
  videos: Schema.Types.ObjectId;
  nsfw: boolean;
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
      maxlength: [100, "Title should not exceed 100 characters"],
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
    videos: {
      type: [Schema.Types.ObjectId],
      ref: "Video",
      default: [],
    },
    nsfw: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Enable full-text search on the playlist title
playlistSchema.index({ title: "text" });

// Aggregate Paginate v2
playlistSchema.plugin(mongooseAggregatePaginate);

export const Playlist = mongoose.model<
  PlaylistDocument,
  AggregatePaginateModel<PlaylistDocument>
>("Playlist", playlistSchema);
