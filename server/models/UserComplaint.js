const mongoose = require("mongoose");

const UserComplaintSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    order_number: {
      type: String,
      required: true,
    },
    complaint_for: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserComplaint = mongoose.model(
  "Complaint_complaints",
  UserComplaintSchema
);

module.exports = UserComplaint;
