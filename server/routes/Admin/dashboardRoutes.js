const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  getDashboardDetails,
  getWeeklyOrdersData,
  generateOrderReport,
  generateStockReport,
  updateUserStatus,
} = require("./Controllers/DashboardController");

// @route GET api/admin/dashboard
// @desc Get Dashboard list
// @access Private
router.get("/", [auth.Admin], getDashboardDetails);

// @route GET api/admin/dashboard/order-weekly-data
// @desc Get Dashboard Order Graph Data
// @access Private
router.get("/order-weekly-data", [auth.Admin], getWeeklyOrdersData);

// @route GET api/admin/dashboard/order-report
// @desc Get Dashboard order report
// @access Private
router.get("/order-report", [auth.Admin], generateOrderReport);

// @route GET api/admin/dashboard/stock-report
// @desc Get Dashboard stock report
// @access Private
router.get("/stock-report", [auth.Admin], generateStockReport);

// @route POST api/admin/dashboard/:user_id/user-status
// @desc Approve or delete User
// @access Private
router.post("/:user_id/user-status", [auth.Admin], updateUserStatus);

module.exports = router;
