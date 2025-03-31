import mongoose, { Document, Schema } from "mongoose";

enum VoteStatus {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
}

interface VoteObject extends Document {
  votedBy: Schema.Types.ObjectId;
  vote: VoteStatus;
  video?: Schema.Types.ObjectId;
  post?: Schema.Types.ObjectId;
  comment?: Schema.Types.ObjectId;
}

const voteSchema = new Schema(
  {
    votedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vote: {
      type: String,
      enum: Object.values(VoteStatus),
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
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

export const Vote = mongoose.model<VoteObject>("Vote", voteSchema);
