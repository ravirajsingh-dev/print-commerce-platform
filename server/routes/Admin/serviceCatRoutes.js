const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const response = require("../../config/response");
const service_cat_dir = "./public/uploads/service-categories";

const {
  getServiceCatsList,
  createServiceCat,
  getServiceCatById,
  updateServiceCatById,
  deleteServiceCatById,
  updateServiceCatStatusById,
  changeServiceCatPasswordByID,
  getServiceCatsListAll,
} = require("./Controllers/ServiceCatController");

const storeServiceCatImage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.exists(service_cat_dir, function (exists) {
      if (!exists) {
        fs.mkdirSync(service_cat_dir, { recursive: true });
      }
      cb(null, service_cat_dir);
    });
  },
  filename: function (req, file, cb) {
    req.body = JSON.parse(JSON.stringify(req.body));
    const filename = file.originalname;
    cb(null, "product-image-" + Date.now() + "-" + filename);
  },
});

const uploadImage = multer({
  storage: storeServiceCatImage,
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

// @route GET api/admin/serviceCats/list
// @desc Get serviceCats list
// @access Private
router.get("/list", [auth.Admin], getServiceCatsList);

// @route POST api/admin/serviceCat
// @desc Create ServiceCat
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
  [
    auth.Admin,
    [
      check("title", "Please provide the ServiceCat Name.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 60 })
        .withMessage("The ServiceCat Name must be maximum 60 chars long"),
    ],
  ],
  createServiceCat
);

// @route DELETE api/admin/serviceCats/list-all
// @desc Get serviceCats list without pagination
// @access Private
router.get("/list-all", [auth.Admin], getServiceCatsListAll);

// @route GET api/admin/serviceCats/:service_cat_id
// @desc Get serviceCat by service_cat_id
// @access Private
router.get("/:service_cat_id", [auth.Admin], getServiceCatById);

// @route PUT api/admin/serviceCats/:service_cat_id/update-satus
// @desc Update serviceCat status by service_cat_id
// @access Private
router.put(
  "/:service_cat_id/update-status",
  [auth.Admin],
  updateServiceCatStatusById
);

// @route POST api/admin/serviceCats/:service_cat_id
// @desc Edit serviceCat profile by service_cat_id
// @access Private
router.put(
  "/:service_cat_id",
  [
    auth.Admin,
    [
      check("title", "Please provide the ServiceCat Name.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 60 })
        .withMessage("The ServiceCat Name must be maximum 60 chars long"),
    ],
  ],
  updateServiceCatById
);

// @route PUT api/admin/serviceCats/:service_cat_id/update-password
// @desc Update serviceCat password
// @access Private
router.put(
  "/:service_cat_id/update-password",
  [auth.Admin],
  changeServiceCatPasswordByID
);

// @route DELETE api/admin/serviceCats/:service_cat_id
// @desc Delete serviceCat by service_cat_id
// @access Private
router.delete("/:service_cat_id", [auth.Admin], deleteServiceCatById);

module.exports = router;
