const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");
const multer = require("multer");
const response = require("../../config/response");
const product_dir = "./public/uploads/product";

const Product = require("../../models/Product");

const {
  getProductsList,
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  updateProductStatusById,
  changeProductPasswordByID,
  getProductsListAll,
} = require("./Controllers/ProductController");

const storeProductImage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.exists(product_dir, function (exists) {
      if (!exists) {
        fs.mkdirSync(product_dir, { recursive: true });
      }
      cb(null, product_dir);
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

// @route GET api/admin/products/list
// @desc Get products list
// @access Private
router.get("/list", [auth.Admin], getProductsList);

// @route POST api/admin/product
// @desc Create Product
// @access Private
router.post(
  "/",
  function (req, res, next) {
    let onlyOnce = true;
    uploadImage.single("product_image")(req, res, function (err) {
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
      check("title", "Please provide the Product Name.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 60 })
        .withMessage("The Product Name must be maximum 60 chars long"),
    ],
  ],
  createProduct
);

// @route DELETE api/admin/products/list-all
// @desc Get products list without pagination
// @access Private
router.get("/list-all", [auth.Admin], getProductsListAll);

// @route GET api/admin/products/:product_id
// @desc Get product by product_id
// @access Private
router.get("/:product_id", [auth.Admin], getProductById);

// @route PUT api/admin/products/:product_id/update-satus
// @desc Update product status by product_id
// @access Private
router.put("/:product_id/update-status", [auth.Admin], updateProductStatusById);

// @route POST api/admin/products/:product_id
// @desc Edit product profile by product_id
// @access Private
router.put(
  "/:product_id",
  [
    auth.Admin,
    [
      check("title", "Please provide the Product Name.")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 60 })
        .withMessage("The Product Name must be maximum 60 chars long"),
    ],
  ],
  updateProductById
);

// @route PUT api/admin/products/:product_id/update-password
// @desc Update product password
// @access Private
router.put(
  "/:product_id/update-password",
  [auth.Admin],
  changeProductPasswordByID
);

// @route DELETE api/admin/products/:product_id
// @desc Delete product by product_id
// @access Private
router.delete("/:product_id", [auth.Admin], deleteProductById);

module.exports = router;
