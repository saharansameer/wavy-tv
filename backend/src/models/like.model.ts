import mongoose, { Document, Schema } from "mongoose";

interface LikeObject extends Document {
  likedBy: Schema.Types.ObjectId;
  video: Schema.Types.ObjectId;
}

const likeSchema = new Schema(
  {
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model<LikeObject>("Like", likeSchema);
