const mongoose = require("mongoose");
const { Schema } = mongoose;

const WalletRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    payment_details: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["bank", "upi"],
      required: true,
    },
    txn_number: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["in_review", "success", "cancelled"],
      default: "in_review",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    reasonForCancel: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const WalletRequest = mongoose.model("wallet_request", WalletRequestSchema);

module.exports = WalletRequest;
