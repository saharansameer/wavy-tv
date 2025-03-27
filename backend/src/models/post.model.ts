import mongoose, { Document, Schema } from "mongoose";

interface PostObject extends Document {
  publicId: string;
  content: string;
  owner: Schema.Types.ObjectId;
  upvotes: number;
  downvotes: number;
}

const postSchema = new Schema(
  {
    publicId: {
      type: String,
      required: [true, "publicId is required"],
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      match: [
        /[a-zA-Z0-9]/,
        "Content can not be empty and must contain a valid letter",
      ],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: {
      type: Number,
      default: 1,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model<PostObject>("Post", postSchema);
