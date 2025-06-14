import mongoose, { AggregatePaginateModel, Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface CommentDocument extends Document {
  content: string;
  owner: Schema.Types.ObjectId;
  video?: Schema.Types.ObjectId;
  post?: Schema.Types.ObjectId;
  parentComment?: Schema.Types.ObjectId;
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
      maxlength: [1000, "Comment should not exceed 1000 characters"],
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
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model<
  CommentDocument,
  AggregatePaginateModel<CommentDocument>
>("Comment", commentSchema);
