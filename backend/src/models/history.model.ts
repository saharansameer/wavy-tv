import mongoose, { Schema, Document, AggregatePaginateModel } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface HistoryDocument extends Document {
  video: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}

const historySchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

historySchema.plugin(mongooseAggregatePaginate);

export const History = mongoose.model<
  HistoryDocument,
  AggregatePaginateModel<HistoryDocument>
>("History", historySchema);
