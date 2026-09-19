const mongoose = require("mongoose");

const ServiceCatSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "products",
    },
    product_service: {
      type: mongoose.Types.ObjectId,
      ref: "product_services",
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    production_time: {
      type: String,
    },
    price: {
      type: Number,
    },
    price_per_square: {
      type: Number,
    },
    stock: {
      type: String,
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

const ServiceCategory = mongoose.model("service_categories", ServiceCatSchema);

module.exports = ServiceCategory;
