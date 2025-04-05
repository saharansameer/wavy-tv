import { Schema, model, Document, AggregatePaginateModel } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { excludedTags } from "../utils/constants.js";

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
    tags: {
      type: [String],
    },
  },
  { timestamps: true }
);

videoSchema.pre<VideoDocument>("save", async function (next) {
  const tagsSet = new Set<string>(); // To store unique tags

  // Convert to lowercase and remove non-alphanumerics
  const cleanWord = (word: string) => {
    return word.toLowerCase().replace(/[^\w]/g, "");
  };

  // Extract tags from title
  this.title.split(" ").forEach((word) => {
    const tag = cleanWord(word);

    if (tag && !excludedTags.includes(tag)) {
      tagsSet.add(tag); // Add cleaned tag if not excluded
    }
  });

  // Extract max 5 hashtags from description (if any)
  if (this.description !== undefined) {
    this.description
      .split(" ")
      .filter((word) => word.startsWith("#")) // Only hashtags
      .slice(0, 5) // Limit to first 5
      .map((word) => cleanWord(word)) // Clean them
      .forEach((tag) => {
        if (tag && !excludedTags.includes(tag)) {
          tagsSet.add(tag); // Add cleaned hashtag if not excluded
        }
      });
  }

  this.tags = Array.from(tagsSet); // Assign unique, cleaned tags

  return next(); // Proceed with save
});

// Enable Indexing for tags array
videoSchema.index({ tags: 1 });

// Aggregate Paginate v2
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model<
  VideoDocument,
  AggregatePaginateModel<VideoDocument>
>("Video", videoSchema);
