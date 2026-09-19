const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define userOTP schema
const userOTPSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
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

const UserOTP = mongoose.model("user_otps", userOTPSchema);

module.exports = UserOTP;
