import mongoose, { Document, Schema } from "mongoose";

enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
}

enum CurrencyType {
  INR = "INR",
}

interface SubscriptionObject extends Document {
  channel: Schema.Types.ObjectId;
  subscriber: Schema.Types.ObjectId;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  renewDate?: Date;
  amount: number;
  currency: CurrencyType;
  razorpaySubscriptionId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

const subscriptionSchema = new Schema(
  {
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    renewDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      enum: Object.values(CurrencyType),
    },
    razorpaySubscriptionId: {
      type: String,
      required: true,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<SubscriptionObject>(
  "Subscription",
  subscriptionSchema
);
