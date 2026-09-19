const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define adminOTP schema
const adminOTPSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
      maxLength: 6,
      minLength: 6,
    },
    expiry: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      default: 1, // 1 = Unused, 2 = Used
    },
    usedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const AdminOTP = mongoose.model("admin_otps", adminOTPSchema);

module.exports = AdminOTP;
