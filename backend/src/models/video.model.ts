import { Schema, model, Document, AggregatePaginateModel } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

enum PublishStatus {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
}

interface VideoDocument extends Document {
  publicId: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: string;
  videoFile: string;
  videoFilePublicId: string;
  thumbnail?: string;
  thumbnailPublicId?: string;
  publishStatus: PublishStatus;
  nsfw: boolean;
  tags: string[];
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
      maxlength: [100, "Title should not exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [5000, "Description should not exceed 5000 characters"],
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
    nsfw: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      index: true,
    },
  },
  { timestamps: true }
);

// Enable full-text search on the video title
videoSchema.index({ title: "text" });

// Aggregate Paginate v2
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model<
  VideoDocument,
  AggregatePaginateModel<VideoDocument>
>("Video", videoSchema);
