const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const _ = require("lodash");
const User = require("../../../models/User");

const standard_password = require("../../../utils/constants");

const {
  forgotPassword,
  verifyOtp,
  updatePassword,
} = require("./Controllers/ForgotPasswordController");

// @route POST /api/forgot-password
// @desc Send OTP for reset password
// @access Public
router.post(
  "/",
  [
    check("email", "Email ID is required")
      .isString()
      .custom(async (value, { req }) => {
        if (value) {
          console.log("value", value);

          const formatedEmail = value.toLowerCase();

          const user = await User.findOne({
            email: formatedEmail,
          });
          if (!user) {
            throw new Error("Something went wrong, try again.");
          }
        }
      }),
  ],
  forgotPassword
);

// @route POST /api/forgot-password/verify-otp
// @desc Generate reset password link
// @access Public
router.post(
  "/verify-otp",
  [
    check("email", "Email ID is required")
      .isString()
      .custom(async (value, { req }) => {
        if (value) {
          const formatedEmail = value.toLowerCase();

          const user = await User.findOne({
            email: formatedEmail,
          });
          if (!user) {
            throw new Error("Something went wrong, try again.");
          }
        }
      }),

    check("otp", "One-Time Password (OTP) is required").isLength({
      min: 6,
      max: 6,
    }),
  ],
  verifyOtp
);

// @route POST /api/forgot-password/update-password
// @desc Generate reset password link
// @access Public
router.post(
  "/update-password",
  [
    check("email", "Email ID is required")
      .isString()
      .custom(async (value, { req }) => {
        if (value) {
          const formatedEmail = value.toLowerCase();

          const user = await User.findOne({
            email: formatedEmail,
          });
          if (!user) {
            throw new Error("Something went wrong, try again.");
          }
        }
      }),

    check("otp", "One-Time Password (OTP) is required").isLength({
      min: 6,
      max: 6,
    }),
    check("password", standard_password.validation_msg).matches(
      standard_password.validation_pattern
    ),
  ],
  updatePassword
);

module.exports = router;
