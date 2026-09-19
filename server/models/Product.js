const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Types.ObjectId,
      ref: "services",
    },
    product_sku: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    product_image: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Number,
      default: 1, // 1 for Active , 2 For In Active
    },
    lastEditedBy: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;
