import mongoose, { Document, Schema } from "mongoose";

interface CommentObject extends Document {
  publicId: string;
  content: string;
  owner: Schema.Types.ObjectId;
  video?: Schema.Types.ObjectId;
  post?: Schema.Types.ObjectId;
  parentComment?: Schema.Types.ObjectId;
}

const commentSchema = new Schema(
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
      ref: "Video"
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post"
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<CommentObject>("Comment", commentSchema);
