import mongoose, {
  AggregatePaginateModel,
  Document,
  Schema,
  Types,
} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface FollowDocument extends Document {
  channel: Types.ObjectId;
  follower: Types.ObjectId;
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

followSchema.plugin(mongooseAggregatePaginate);

export const Follow = mongoose.model<
  FollowDocument,
  AggregatePaginateModel<FollowDocument>
>("Follow", followSchema);
