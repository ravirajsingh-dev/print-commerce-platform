const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const {
  getUsersList,
  getServicesList,
  getProductsList,
  getProductServicesListByID,
  getProductServiceCategoriesListByID,
  generateQRCode,
  getAdminPrimeCredentials,
  getProductServicesListByID2,
  getAdminDetails,
  getBannersList,
  deductMoneyFromWallet,
} = require("./Controllers/CommonController");

// @route GET api/common/users-list
// @desc Get Users list
// @access Private
router.get("/users-list", [auth.Admin], getUsersList);

// @route POST api/common/:user_id/deduct-money
// @desc Deduct money from user wallet
// @access Private
router.post("/:user_id/deduct-money", [auth.Admin], deductMoneyFromWallet);

/////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Use Side /////////////////////////////////////////////////////////////////

// @route GET api/common/services-list
// @desc Get Services list
// @access Public
router.get("/services-list", [], getServicesList);

// @route GET api/common/products-list
// @desc Get Products list
// @access Public
router.get("/products-list", [], getProductsList);

// @route GET api/common/product-services/:product_id
// @desc Get Product Services list By ID
// @access Public
router.get(
  "/product-services/:product_id/list-full",
  [],
  getProductServicesListByID2
);

// @route GET api/common/product-services/:product_id
// @desc Get Product Services list By ID
// @access Public
router.get("/product-services/:product_id", [], getProductServicesListByID);

// @route GET api/common/services-categories/:product_service_id
// @desc Get Product Services Categories list By ID
// @access Public
router.get(
  "/services-categories/:product_service_id",
  [],
  getProductServiceCategoriesListByID
);

// @route GET /api/common/generate-qr/:upi_id/:amount
// @desc Generare QR code with amount
// @access Public
router.get("/generate-qr/:upi_id/:amount", [], generateQRCode);

// @route GET /api/common/generate-qr/:upi_id/:amount
// @desc Generare QR code with amount
// @access Public
router.get("/admin/credentials", [], getAdminPrimeCredentials);

// @route GET /api/common/admin/details
// @desc Get admin info
// @access Public
router.get("/admin/details", [], getAdminDetails);

// @route GET /api/common/admin/details
// @desc Get admin info
// @access Public
router.get("/banners-list", [], getBannersList);

module.exports = router;
