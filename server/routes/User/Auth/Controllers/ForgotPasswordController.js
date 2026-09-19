const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const response = require("../../../../config/response");
const { randomUUID } = require("crypto");
const User = require("../../../../models/User");
const UserOTP = require("../../../../models/UserOTP");
const { generateOtp, maskEmail } = require("../../../../utils/helper");
const initEmail = require("../../../../customClasses/email");

module.exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array().reverse());
  }

  try {
    const { email, resendOTP } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("name email")
      .lean();
    if (!user) {
      return response.errorResponse(res, {}, "User not found.", 404);
    }

    if (!user.email) {
      return response.errorResponse(
        res,
        {},
        "No email is set up for this account. Contact support.",
        404
      );
    }

    // Remove previous unused OTPs for the user
    await UserOTP.deleteMany({ user: user._id, status: 1 });

    // Generate new OTP
    const otpValue = generateOtp(6);
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await UserOTP.create({ user: user._id, otp: otpValue, expiry: expiryDate });

    // Send OTP email
    await initEmail("user-reset-password-email", {
      email: user.email,
      name: user.name,
      otp: otpValue,
    });

    const maskedEmail = maskEmail(user.email);
    const message = `One-Time Password (OTP) has been ${
      resendOTP ? "resent" : "sent"
    } to ${maskedEmail}.`;

    return response.successResponse(res, {}, message);
  } catch (err) {
    console.error("Error during forgot password process:", err);
    return response.errorResponse(
      res,
      {},
      "Server error. Please try again later.",
      500
    );
  }
};

module.exports.verifyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array().reverse());
  }

  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("name email")
      .lean();
    if (!user) {
      return response.errorResponse(res, {}, "User not found.", 404);
    }

    const otpRecord = await UserOTP.findOne({
      user: user._id,
      otp,
      status: 1,
    }).lean();
    if (!otpRecord || otpRecord.expiry < new Date()) {
      return response.errorResponse(
        res,
        { msg: "Invalid or expired OTP." },
        "Invalid or expired OTP.",
        400
      );
    }

    return response.successResponse(
      res,
      { msg: "OTP verified. You can now reset your password." },
      "OTP verified."
    );
  } catch (err) {
    console.error("Error during OTP verification process:", err);
    return response.errorResponse(
      res,
      {},
      "Server error. Please try again later.",
      500
    );
  }
};

module.exports.updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array().reverse());
  }

  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "name email password"
    );
    if (!user) {
      return response.errorResponse(res, {}, "User not found.", 404);
    }

    const otpRecord = await UserOTP.findOne({ user: user._id, otp, status: 1 });
    if (!otpRecord || otpRecord.expiry < new Date()) {
      return response.errorResponse(
        res,
        { msg: "Invalid or expired OTP." },
        "Invalid or expired OTP.",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.uuid = randomUUID();
    await user.save();

    otpRecord.status = 2;
    otpRecord.usedAt = new Date();
    await otpRecord.save();

    return response.successResponse(
      res,
      { msg: "Password updated successfully." },
      "Password updated successfully."
    );
  } catch (err) {
    console.error("Error during password update:", err);
    return response.errorResponse(
      res,
      {},
      "Server error. Please try again later.",
      500
    );
  }
};
