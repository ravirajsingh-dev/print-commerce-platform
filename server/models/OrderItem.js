const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product_services",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service_categories",
      required: false,
    },
    quantity: {
      type: Number,
      // required: true,
    },
    quality: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    width_feet: {
      type: Number,
    },
    height_feet: {
      type: Number,
    },
    total_square_fit: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    remarks: {
      type: String,
    },
    lamination: {
      type: String,
    },
    role_used: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const OrderItem = mongoose.model("order_items", OrderItemSchema);

module.exports = OrderItem;
