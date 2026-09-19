const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");
const response = require("../../config/response");
const multer = require("multer");
const service_dir = "./public/uploads/service";

const Service = require("../../models/Service");

const {
  getServicesList,
  createService,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  updateServiceStatusById,
  changeServicePasswordByID,
  getServicesListAll,
} = require("./Controllers/ServiceController");

const storeServiceImage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.exists(service_dir, function (exists) {
      if (!exists) {
        fs.mkdirSync(service_dir, { recursive: true });
      }
      cb(null, service_dir);
    });
  },
  filename: function (req, file, cb) {
    req.body = JSON.parse(JSON.stringify(req.body));
    const filename = file.originalname;
    cb(null, "service-image-" + Date.now() + "-" + filename);
  },
});

const uploadImage = multer({
  storage: storeServiceImage,
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

// @route GET api/admin/services/list
// @desc Get services list
// @access Private
router.get("/list", [auth.Admin], getServicesList);

// @route POST api/admin/service
// @desc Create Service
// @access Private
router.post(
  "/",
  function (req, res, next) {
    let onlyOnce = true;
    uploadImage.single("service_image")(req, res, function (err) {
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
  [
    auth.Admin,
    [
      check("title", "Please provide the Service Name.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ min: 5, max: 100 })
        .withMessage(
          "The Service Name must be minimum 5 and maximum 100 chars long"
        ),

      check("service_url", "Please provide the Service URL.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ min: 5, max: 100 })
        .withMessage(
          "The Service url must be minimum 5 and maximum 100 chars long"
        ),

      check("description", "Please provide the Service Description.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ min: 10, max: 250 })
        .withMessage(
          "The Service url must be minimum 10 and maximum 250 chars long"
        ),
    ],
  ],
  createService
);

// @route DELETE api/admin/services/list-all
// @desc Get services list without pagination
// @access Private
router.get("/list-all", [auth.Admin], getServicesListAll);

// @route GET api/admin/services/:service_id
// @desc Get service by service_id
// @access Private
router.get("/:service_id", [auth.Admin], getServiceById);

// @route PUT api/admin/services/:service_id/update-satus
// @desc Update service status by service_id
// @access Private
router.put("/:service_id/update-status", [auth.Admin], updateServiceStatusById);

// @route POST api/admin/services/:service_id
// @desc Edit service profile by service_id
// @access Private
router.put(
  "/:service_id",
  [
    auth.Admin,
    [
      check("title", "Please provide the Service Name.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 60 })
        .withMessage("The Service Name must be maximum 60 chars long"),
    ],
  ],
  updateServiceById
);

// @route PUT api/admin/services/:service_id/update-password
// @desc Update service password
// @access Private
router.put(
  "/:service_id/update-password",
  [auth.Admin],
  changeServicePasswordByID
);

// @route DELETE api/admin/services/:service_id
// @desc Delete service by service_id
// @access Private
router.delete("/:service_id", [auth.Admin], deleteServiceById);

module.exports = router;
