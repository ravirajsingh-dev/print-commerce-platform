const mongoose = require("mongoose");

const ProductServiceSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "products",
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Number,
      default: 1, // 1 for Active , 2 For In Active
    },
    production_time: {
      type: String,
    },
    price: {
      type: String,
    },
    price_per_square: {
      type: String,
    },
    stock: {
      type: Number,
    },
    description: {
      type: String,
    },
    fields: {
      type: Object,
    },
    quality: {
      type: Object,
    },
    isCatExist: {
      type: Boolean,
      default: false,
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

const ProductService = mongoose.model("product_services", ProductServiceSchema);

module.exports = ProductService;
