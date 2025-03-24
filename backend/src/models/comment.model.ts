import mongoose, { Document, Schema } from "mongoose";

interface CommentObject extends Document {
  content: string;
  owner: Schema.Types.ObjectId;
  video?: Schema.Types.ObjectId;
  post?: Schema.Types.ObjectId;
  upvotes: number;
  downvotes: number;
}

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      match: [
        /[a-zA-Z0-9]/,
        "Comment can not be empty and must contain a valid letter",
      ],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
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

export const Comment = mongoose.model<CommentObject>("Comment", commentSchema);
