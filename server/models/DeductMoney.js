const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define wallet schema
const DeductMoneySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DeductMoney = mongoose.model("deduct_money", DeductMoneySchema);

module.exports = DeductMoney;
