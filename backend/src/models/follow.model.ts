import mongoose, { Document, Schema } from "mongoose";

interface FollowObject extends Document {
  channel: Schema.Types.ObjectId;
  follower: Schema.Types.ObjectId;
}

const followSchema = new Schema(
  {
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Follow = mongoose.model<FollowObject>("Follow", followSchema);
