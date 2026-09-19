const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");
const multer = require("multer");
const response = require("../../config/response");
const banner_dir = "./public/uploads/banner";

const Banner = require("../../models/Banner");

const {
  getBannersList,
  createBanner,
  getBannerById,
  updateBannerById,
  deleteBannerById,
  updateBannerStatusById,
  changeBannerPasswordByID,
} = require("./Controllers/BannerController");

const storeBannerImage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.exists(banner_dir, function (exists) {
      if (!exists) {
        fs.mkdirSync(banner_dir, { recursive: true });
      }
      cb(null, banner_dir);
    });
  },
  filename: function (req, file, cb) {
    req.body = JSON.parse(JSON.stringify(req.body));
    const filename = file.originalname;
    cb(null, "banner-image-" + Date.now() + "-" + filename);
  },
});

const uploadImage = multer({
  storage: storeBannerImage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    const match = ["image/jpeg", "image/png"];
    if (match.indexOf(file.mimetype) === -1) {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: { fileSize: 5000000 },
});

// @route GET api/admin/banners/list
// @desc Get banners list
// @access Private
router.get("/list", [auth.Admin], getBannersList);

// @route POST api/admin/banner
// @desc Create Banner
// @access Private
router.post(
  "/",
  function (req, res, next) {
    let onlyOnce = true;
    uploadImage.single("image")(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return response.errorResponse(
            res,
            {
              msg: "Attached file is too large. Exceed allowed file limit: 5MB",
            },
            "Attached file is too large. Exceed allowed file limit: 5MB",
            400
          );
        }
        return response.errorResponse(
          res,
          { msg: err.message },
          err.message,
          400
        );
      }
      if (onlyOnce) {
        onlyOnce = false;
        next();
      }
    });
    req.body = JSON.parse(JSON.stringify(req.body));
  },
  [auth.Admin, [check("image", "Image is required.")]],
  createBanner
);

// @route GET api/admin/banners/:banner_id
// @desc Get banner by banner_id
// @access Private
router.get("/:banner_id", [auth.Admin], getBannerById);

// @route PUT api/admin/banners/:banner_id/update-satus
// @desc Update banner status by banner_id
// @access Private
router.put("/:banner_id/update-status", [auth.Admin], updateBannerStatusById);

// @route POST api/admin/banners/:banner_id
// @desc Edit banner profile by banner_id
// @access Private
router.put(
  "/:banner_id",
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
          let is_banner_exist = await Banner.findOne({
            _id: { $ne: req.params.banner_id },
            email: value,
          });

          if (!_.isEmpty(is_banner_exist)) {
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
          let is_banner_exist = await Banner.findOne({
            _id: { $ne: req.params.banner_id },
            phone: value,
          });

          if (!_.isEmpty(is_banner_exist)) {
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
  updateBannerById
);

// @route PUT api/admin/banners/:banner_id/update-password
// @desc Update banner password
// @access Private
router.put(
  "/:banner_id/update-password",
  [auth.Admin],
  changeBannerPasswordByID
);

// @route DELETE api/admin/banners/:banner_id
// @desc Delete banner by banner_id
// @access Private
router.delete("/:banner_id", [auth.Admin], deleteBannerById);

module.exports = router;
