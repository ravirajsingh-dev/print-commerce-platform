const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    service_sku: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    service_image: {
      type: String,
    },
    service_url: {
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

const Service = mongoose.model("services", ServiceSchema);

module.exports = Service;
