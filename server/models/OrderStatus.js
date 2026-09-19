const mongoose = require("mongoose");

const OrderStatusSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "admins",
    },
    reasonForCancel: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const OrderStatus = mongoose.model("order_status", OrderStatusSchema);

module.exports = OrderStatus;
