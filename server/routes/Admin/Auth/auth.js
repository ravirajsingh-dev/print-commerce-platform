const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const _ = require("lodash");
const { APP_ENV } = require("../../../config/config");
const {
  register,
  getSponsorUserDetails,
} = require("./Controllers/RegisterController");

const auth = require("../../../middleware/auth");

const User = require("../../../models/User");

const AuthController = require("./Controllers/AuthController");
const standard_password = require("../../../utils/constants");

// @route POST api/auth
// @desc Aunthicate user
// @access Public
router.post(
  "/",
  [
    check("email", "Email is required").trim(),
    check("password", "Password is required"),
  ],
  AuthController.login
);

router.post(
  "/signup",
  [
    check("name", "Name is required and should be at most 50 characters long")
      .isString()
      .isLength({ max: 50 }),

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

    // check(
    //   "ccode",
    //   "Country code is required and should be at most 5 characters long"
    // )
    //   .isString()
    //   .isLength({ min: 1, max: 5 }),

    check(
      "sponsorH2C",
      "H2C ID is required and should be at most 8 characters long"
    )
      .isString()
      .isLength({ max: 9 })
      .custom(async (value, { req }) => {
        if (value) {
          const capitalSponsorID = value.toUpperCase();

          const sponsorBy = await User.findOne({
            H2C_ID: capitalSponsorID,
          });
          if (!sponsorBy) {
            throw new Error("No user found with this sponsor ID");
          }
        }
      }),

    check(
      "position",
      "Position is required and should be either 'left' or 'right'"
    ).isIn(["left", "right"]),

    check(
      "city",
      "District is required and should be at most 50 characters long"
    )
      .isString()
      .isLength({ max: 50 }),

    check("state", "State is required and should be at most 50 characters long")
      .isString()
      .isLength({ max: 50 }),

    check(
      "country",
      "Country code is required and should be exactly 2 characters long"
    )
      .isString()
      .isLength({ min: 2, max: 2 }),

    check("captchaToken", "Captcha token is required").not().isEmpty(),

    check("password", standard_password.validation_msg).matches(
      standard_password.validation_pattern
    ),
  ],
  async (req, res) => {
    try {
      await register(req, res);
    } catch (error) {
      console.error("Error handling user registration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// @route GET api/auth/
// @desc Load user
// @access Private
router.get("/", auth.Admin, AuthController.checkAuth);

// @route PUT api/auth/logout
// @desc Logout user
// @access Public
router.put("/logout", auth.User, AuthController.logout);

router.get("/", auth.User, AuthController.checkAuth);

// @route POST api/auth/set-txn-password
// @desc Set tnx password
// @access Private (requires authentication)
router.post(
  "/set-txn-password",
  auth.User,
  [
    check("txnPassword", standard_password.validation_msg).matches(
      standard_password.validation_pattern
    ),
  ],
  AuthController.setTxnPassword
);

// @route POST api/auth/change-txn-password
// @desc Change tnx password
// @access Private (requires authentication)
router.post(
  "/change-txn-password",

  auth.User,
  [
    check("oldTxnPassword", standard_password.validation_msg).matches(
      standard_password.validation_pattern
    ),

    check("txnPassword", standard_password.validation_msg).matches(
      standard_password.validation_pattern
    ),
  ],
  AuthController.changeTxnPassword
);

// @route PUT api/auth/users/profile
// @desc Update User Profile
// @access Private (requires authentication)
router.put("/profile", [auth.User], AuthController.updateUserProfileByID);

// @route PUT api/admin/profile/password
// @desc Get Change profile password
// @access Private
router.put(
  "/password",
  [
    auth.User,
    [
      check("current_password", "Please enter current password")
        .not()
        .trim()
        .isEmpty(),
      check("password", standard_password.validation_msg)
        .trim()
        .matches(standard_password.validation_pattern),
      check("confirm_password", standard_password.validation_msg)
        .trim()
        .isLength({ min: 8 })
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            // throw error if passwords do not match
            throw new Error("Passwords do not match");
          } else {
            return value;
          }
        }),
    ],
  ],
  AuthController.changePassword
);

module.exports = router;
