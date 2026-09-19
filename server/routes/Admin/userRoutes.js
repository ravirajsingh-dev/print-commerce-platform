const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");

const User = require("../../models/User");

const {
  getUsersList,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserStatusById,
  changeUserPasswordByID,
  createUserRequest,
  activationNewUser,
} = require("./Controllers/UserController");

// @route GET api/admin/users/list
// @desc Get users list
// @access Private
router.get("/list", [auth.Admin], getUsersList);

// @route POST api/admin/user
// @desc Create User
// @access Private
router.post(
  "/",
  [
    auth.Admin,
    [
      check("business_name", "Please provide the business name")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 150 })
        .withMessage("The Business Name must be maximum 150 chars long"),

      check("name", "Please provide the name")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 150 })
        .withMessage("The Name must be maximum 150 chars long"),

      check("email", "Enter a valid email")
        .isEmail()
        .withMessage("The Email provided is not valid")
        .normalizeEmail({ gmail_remove_dots: false })
        .custom(async (value) => {
          let is_user_exist = await User.findOne({ email: value });
          if (!_.isEmpty(is_user_exist)) {
            throw new Error("The email provided is already registered");
          }
        }),

      check("phone")
        .exists({ checkFalsy: true })
        .withMessage("Phone number is required.")
        .isMobilePhone("any", { strictMode: false })
        .withMessage("Enter a valid phone number.")
        .bail()
        .custom(async (value) => {
          const userExists = await User.findOne({ phone: value });
          if (userExists) {
            throw new Error("Provided phone number is already registered.");
          }
        }),

      check("address", "Please provide the Address")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Address is Required"),

      check("city", "Please provide the City")
        .not()
        .trim()
        .isEmpty()
        .withMessage("City is Required"),

      check("state", "Please provide the State")
        .not()
        .trim()
        .isEmpty()
        .withMessage("State is Required"),

      check("pin_code", "Please provide the Pin Code")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Pin Code is Required"),
    ],
  ],
  createUser
);

// @route GET api/admin/users/:user_id
// @desc Get user by user_id
// @access Private
router.get("/:user_id", [auth.Admin], getUserById);

// @route PUT api/admin/users/:user_id/update-satus
// @desc Update user status by user_id
// @access Private
router.put("/:user_id/update-status", [auth.Admin], updateUserStatusById);

// @route POST api/admin/users/:user_id
// @desc Edit user profile by user_id
// @access Private
router.put(
  "/:user_id",
  [
    auth.Admin,
    [
      check("business_name", "Please provide the business name")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 150 })
        .withMessage("The Business Name must be maximum 100 chars long"),

      check("name", "Please provide the name")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 100 })
        .withMessage("The Name must be maximum 100 chars long"),
      check("email", "Enter a valid email")
        .isEmail()
        .custom(async (value, { req }) => {
          let is_user_exist = await User.findOne({
            _id: { $ne: req.params.user_id },
            email: value,
          });

          if (!_.isEmpty(is_user_exist)) {
            throw new Error("Provided email is already registered");
          }
        }),

      check("phone")
        .exists({ checkFalsy: true })
        .withMessage("Phone number is required.")
        .isMobilePhone("any", { strictMode: false })
        .withMessage("Enter a valid phone number.")
        .bail()
        .custom(async (value, { req }) => {
          let is_user_exist = await User.findOne({
            _id: { $ne: req.params.user_id },
            phone: value,
          });

          if (!_.isEmpty(is_user_exist)) {
            throw new Error("Provided phone is already registered");
          }
        }),

      check("address", "Please provide the Address")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Address is Required"),

      check("city", "Please provide the City")
        .not()
        .trim()
        .isEmpty()
        .withMessage("City is Required"),

      check("state", "Please provide the State")
        .not()
        .trim()
        .isEmpty()
        .withMessage("State is Required"),

      check("pin_code", "Please provide the Pin Code")
        .not()
        .trim()
        .isEmpty()
        .withMessage("Pin Code is Required"),
    ],
  ],
  updateUserById
);

// @route PUT api/admin/users/:user_id/activation
// @desc Activate new user
// @access Private
router.put("/:user_id/activation", [auth.Admin], activationNewUser);

// @route PUT api/admin/users/:user_id/update-password
// @desc Update user password
// @access Private
router.put("/:user_id/update-password", [auth.Admin], changeUserPasswordByID);

// @route DELETE api/admin/users/:user_id
// @desc Delete user by user_id
// @access Private
router.delete("/:user_id", [auth.Admin], deleteUserById);

// @route POST api/admin/users/request-id
// @desc Create User
// @access Private
router.post(
  "/request-id",

  [
    check("business_name", "Please provide the business name")
      .not()
      .trim()
      .isEmpty()
      .isLength({ max: 150 })
      .withMessage("The Business Name must be maximum 150 chars long"),

    check("name", "Please provide the name")
      .not()
      .trim()
      .isEmpty()
      .isLength({ max: 150 })
      .withMessage("The Name must be maximum 150 chars long"),

    check("email", "Enter a valid email")
      .isEmail()
      .withMessage("The Email provided is not valid")
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(async (value) => {
        let is_user_exist = await User.findOne({ email: value });
        if (!_.isEmpty(is_user_exist)) {
          throw new Error("The email provided is already registered");
        }
      }),

    check("phone")
      .exists({ checkFalsy: true })
      .withMessage("Phone number is required.")
      .isMobilePhone("any", { strictMode: false })
      .withMessage("Enter a valid phone number.")
      .bail()
      .custom(async (value) => {
        const userExists = await User.findOne({ phone: value });
        if (userExists) {
          throw new Error("Provided phone number is already registered.");
        }
      }),

    check("address", "Please provide the Address")
      .not()
      .trim()
      .isEmpty()
      .withMessage("Address is Required"),

    check("city", "Please provide the City")
      .not()
      .trim()
      .isEmpty()
      .withMessage("City is Required"),

    check("state", "Please provide the State")
      .not()
      .trim()
      .isEmpty()
      .withMessage("State is Required"),

    check("pin_code", "Please provide the Pin Code")
      .not()
      .trim()
      .isEmpty()
      .withMessage("Pin Code is Required"),
  ],
  createUserRequest
);

module.exports = router;
