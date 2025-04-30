import mongoose, { AggregatePaginateModel, Document, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface PostDocument extends Document {
  publicId: string;
  content: string;
  owner: Schema.Types.ObjectId;
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
      maxlength: [2000, "Post content should not exceed 2000 characters"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Aggregate Paginate v2
postSchema.plugin(mongooseAggregatePaginate);

export const Post = mongoose.model<
  PostDocument,
  AggregatePaginateModel<PostDocument>
>("Post", postSchema);
