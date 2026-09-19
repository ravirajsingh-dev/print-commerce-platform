const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const _ = require("lodash");
const Admin = require("../../../models/Admin");

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
    check("email", "Email is required.")
      .isString()
      .custom(async (value, { req }) => {
        if (value) {
          const emailID = value.toLowerCase();

          const admin = await Admin.findOne({
            email: emailID,
          });
          if (!admin) {
            throw new Error("No admin found with this Email");
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
    check("email", "Email is required.")
      .isString()
      .custom(async (value, { req }) => {
        if (value) {
          const emailID = value.toLowerCase();

          const admin = await Admin.findOne({
            email: emailID,
          });
          if (!admin) {
            throw new Error("No admin found with this Email");
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
    check("email", "Email is required.")
      .isString()
      .custom(async (value, { req }) => {
        if (value) {
          const emailID = value.toLowerCase();

          const admin = await Admin.findOne({
            email: emailID,
          });
          if (!admin) {
            throw new Error("No admin found with this Email");
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
