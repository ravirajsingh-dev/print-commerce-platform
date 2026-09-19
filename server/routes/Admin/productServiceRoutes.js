const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const response = require("../../config/response");
const product_service_dir = "./public/uploads/product_services";

const ProductService = require("../../models/ProductService");

const {
  getProductServicesList,
  createProductService,
  getProductServiceById,
  updateProductServiceById,
  deleteProductServiceById,
  updateProductServiceStatusById,
  changeProductServicePasswordByID,
  getProductServicesByID,
  getProductServicesListAll,
} = require("./Controllers/ProductServiceController");

const storeProductImage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.exists(product_service_dir, function (exists) {
      if (!exists) {
        fs.mkdirSync(product_service_dir, { recursive: true });
      }
      cb(null, product_service_dir);
    });
  },
  filename: function (req, file, cb) {
    req.body = JSON.parse(JSON.stringify(req.body));
    const filename = file.originalname;
    cb(null, "product-image-" + Date.now() + "-" + filename);
  },
});

const uploadImage = multer({
  storage: storeProductImage,
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

// @route GET api/admin/product-services/list
// @desc Get products list
// @access Private
router.get("/list", [auth.Admin], getProductServicesList);

// @route GET api/admin/product-services/list-all
// @desc Get products list
// @access Private
router.get("/list-all", [auth.Admin], getProductServicesListAll);

// @route POST api/admin/product
// @desc Create ProductService
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
      check("title", "Please provide the ProductService Name.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 60 })
        .withMessage("The ProductService Name must be maximum 60 chars long"),
    ],
  ],
  createProductService
);

// @route GET api/admin/product-services/:product_id/list
// @desc Get product services list
// @access Private
router.get("/:product_id/list", [auth.Admin], getProductServicesByID);

// @route GET api/admin/product-services/:product_service_id
// @desc Get product by product_service_id
// @access Private
router.get("/:product_service_id", [auth.Admin], getProductServiceById);

// @route PUT api/admin/product-services/:product_service_id/update-satus
// @desc Update product status by product_service_id
// @access Private
router.put(
  "/:product_service_id/update-status",
  [auth.Admin],
  updateProductServiceStatusById
);

// @route POST api/admin/product-services/:product_service_id
// @desc Edit product profile by product_service_id
// @access Private
router.put(
  "/:product_service_id",
  [
    auth.Admin,
    [
      check("title", "Please provide the ProductService Name.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 60 })
        .withMessage("The ProductService Name must be maximum 60 chars long"),
    ],
  ],
  updateProductServiceById
);

// @route PUT api/admin/product-services/:product_service_id/update-password
// @desc Update product password
// @access Private
router.put(
  "/:product_service_id/update-password",
  [auth.Admin],
  changeProductServicePasswordByID
);

// @route DELETE api/admin/product-services/:product_service_id
// @desc Delete product by product_service_id
// @access Private
router.delete("/:product_service_id", [auth.Admin], deleteProductServiceById);

module.exports = router;
