const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    amount: {
      type: Number,
    },
    full_amount: {
      type: Number,
    },
    status: {
      type: String,
      default: "pending",
    },
    reasonForCancel: {
      type: String,
    },
    order_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("orders", OrderSchema);

module.exports = Order;
