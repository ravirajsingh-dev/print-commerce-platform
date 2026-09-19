const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    orderNumber: {
      type: String,
      required: true,
    },
    language: {
      type: String,
    },
    complaintType: {
      type: String,
    },
    complaintDescription: {
      type: String,
    },
    file: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
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

const Complaint = mongoose.model("complaints", ComplaintSchema);

module.exports = Complaint;
