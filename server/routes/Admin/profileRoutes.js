const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");

const Admin = require("../../models/Admin");

const {
  changePassword,
  updateUserProfileById,
  saveUserProfileImage,
} = require("./Controllers/ProfileController");

const standard_password = require("../../utils/constants");

// @route PUT api/admin/profile
// @desc Update profile password
// @access Private
router.put("/", [
  auth.Admin,
  [
    check("name", "Please provide the name")
      .not()
      .trim()
      .isEmpty()
      .isLength({ max: 100 })
      .withMessage("The Name must be maximum 100 chars long"),

    check("email", "Please provide an email address")
      .isEmail()
      .withMessage("The Email provided is not valid")
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(async (value, { req }) => {
        let is_user_exist = await Admin.findOne({
          _id: { $ne: req.user.id },
          email: value,
        });
        if (!_.isEmpty(is_user_exist)) {
          throw new Error("Provided email is already registered.");
        }
      }),

    check("phone")
      .exists({ checkFalsy: true })
      .withMessage("Phone number is required.")
      .isMobilePhone("any", { strictMode: false })
      .withMessage("Enter a valid phone number.")
      .bail()
      .custom(async (value, { req }) => {
        let is_user_exist = await Admin.findOne({
          _id: { $ne: req.params.user_id },
          phone: value,
        });

        if (!_.isEmpty(is_user_exist)) {
          throw new Error("Provided phone is already registered");
        }
      }),
  ],
  updateUserProfileById,
]);

// @route PUT api/admin/profile/upload-profile
// @desc Save Admin Profile
// @access Private
router.put("/upload-profile", [auth.Admin], saveUserProfileImage);

module.exports = router;
