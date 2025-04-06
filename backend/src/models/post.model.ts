import mongoose, { Document, Schema } from "mongoose";

interface PostDocument extends Document {
  publicId: string;
  content: string;
  owner: Schema.Types.ObjectId;
  nsfw: boolean;
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
      maxlength: [1000, "Title should not exceed 1000 characters"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nsfw: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model<PostDocument>("Post", postSchema);
