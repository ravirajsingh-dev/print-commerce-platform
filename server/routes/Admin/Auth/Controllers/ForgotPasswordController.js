const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const response = require("../../../../config/response");

const Admin = require("../../../../models/Admin");
const AdminOTP = require("../../../../models/AdminOTP");

const { generateOtp, maskEmail } = require("../../../../utils/helper");
const initEmail = require("../../../../Notifications/Emails/email");

module.exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array().reverse());
  }

  try {
    const { email, resendOTP } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
      "name email"
    );

    if (!admin) {
      return response.errorResponse(
        res,
        {},
        "Something went wrong, try again.",
        404
      );
    }

    if (!admin.email) {
      return response.errorResponse(
        res,
        {},
        "You have not setup email address in your account. Contact to Developer.",
        404
      );
    }

    await AdminOTP.deleteMany({ admin: admin._id, status: 1 });

    const otpValue = generateOtp(6);
    const expiryDate = new Date(Date.now() + 30 * 60 * 1000);

    const otp = new AdminOTP({
      admin: admin._id,
      otp: otpValue,
      expiry: expiryDate,
    });
    await otp.save();

    const userData = {
      email: admin?.email,
      name: admin?.name,
      otp: otpValue,
    };

    await initEmail("user-reset-password-email", userData);

    const maskedEmail = maskEmail(admin?.email);

    if (resendOTP) {
      return response.successResponse(
        res,
        {},
        `One-Time Password (OTP) has been resent to your registered email address ${maskedEmail}.`
      );
    } else {
      return response.successResponse(
        res,
        {},
        `One-Time Password (OTP) has been sent to your registered email address ${maskedEmail}.`
      );
    }
  } catch (err) {
    console.log("Error during forgot password process:", err);
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

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
      "name email"
    );

    if (!admin) {
      return response.errorResponse(
        res,
        {},
        "Something went wrong, try again.",
        404
      );
    }

    const otpRecord = await AdminOTP.findOne({
      admin: admin._id,
      status: 1,
      otp,
    });

    if (!otpRecord) {
      return response.errorResponse(
        res,
        { msg: "Invalid One-Time Password." },
        "Invalid One-Time Password.",
        400
      );
    }

    if (otpRecord.expiry < new Date()) {
      return response.errorResponse(
        res,
        { msg: "Invalid One-Time Password." },
        "Invalid One-Time Password.",
        400
      );
    }

    return response.successResponse(
      res,
      { msg: "One-Time Password verified. Setup your password." },
      "One-Time Password verified. Setup your password."
    );
  } catch (err) {
    console.log("Error during OTP verification process:", err);
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

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
      "name email password"
    );

    if (!admin) {
      return response.errorResponse(
        res,
        {},
        "Something went wrong, try again.",
        404
      );
    }

    const otpRecord = await AdminOTP.findOne({
      admin: admin._id,
      otp,
      status: 1,
    });

    if (!otpRecord) {
      return response.errorResponse(
        res,
        { msg: "Invalid One-Time Password." },
        "Invalid One-Time Password.",
        400
      );
    }

    if (otpRecord.expiry < new Date()) {
      return response.errorResponse(
        res,
        { msg: "Invalid One-Time Password." },
        "Invalid One-Time Password.",
        400
      );
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    admin.password = newPassword;
    await admin.save();

    otpRecord.status = 2;
    otpRecord.usedAt = new Date();
    await otpRecord.save();

    return response.successResponse(
      res,
      { msg: "Password updated successfully." },
      "Password updated successfully."
    );
  } catch (err) {
    console.log("Error during password update process:", err);
    return response.errorResponse(
      res,
      {},
      "Server error. Please try again later.",
      500
    );
  }
};
