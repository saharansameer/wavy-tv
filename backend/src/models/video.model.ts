import { Schema, model, Document, AggregatePaginateModel } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

enum PublishStatus {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
}

enum Category {
  GENERAL = "GENERAL",
  ENTERTAINMENT = "ENTERTAINMENT",
  GAMING = "GAMING",
  MUSIC = "MUSIC",
  COMEDY = "COMEDY",
  EDUCATION = "EDUCATION",
  PROGRAMMING = "PROGRAMMING",
  SCIENCE = "SCIENCE",
  TECH = "TECH",
  ART = "ART",
  ANIMATION = "ANIMATION",
  GRAPHICS = "GRAPHICS",
}

interface VideoFileData {
  url: string;
  public_id: string;
  duration: number;
  height: number;
  width: number;
  frame_rate: number;
  format: string;
  bytes: number;
  bit_rate: number;
  is_audio: boolean;
}

const videoFileSubSchema = new Schema({
  url: String,
  public_id: String,
  duration: Number,
  height: Number,
  width: Number,
  frame_rate: Number,
  format: String,
  bytes: Number,
  bit_rate: Number,
  is_audio: Boolean,
});

interface ThumbnailData {
  url: string;
  public_id: string;
  format: string;
  bytes: number;
  height: number;
  width: number;
}

const thumbnailSubSchema = new Schema({
  url: String,
  public_id: String,
  format: String,
  bytes: Number,
  height: Number,
  width: Number,
});

interface VideoDocument extends Document {
  publicId: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: string;
  videoFile: VideoFileData;
  thumbnail: ThumbnailData;
  publishStatus: PublishStatus;
  nsfw: boolean;
  category: Category;
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
      type: videoFileSubSchema,
    },
    thumbnail: {
      type: thumbnailSubSchema,
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
    category: {
      type: String,
      enum: Object.values(Category),
      default: Category.GENERAL,
    },
    tags: {
      type: [String],
      index: true,
    },
  },
  { timestamps: true }
);

// Enable full-text search on the video title
videoSchema.index({ title: "text", tags: "text" });

// Aggregate Paginate v2
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model<
  VideoDocument,
  AggregatePaginateModel<VideoDocument>
>("Video", videoSchema);
