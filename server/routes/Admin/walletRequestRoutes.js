const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");

const User = require("../../models/User");

const {
  getWalletRequestList,
  updateWalletRequestStatusById,
} = require("./Controllers/WalletRequestController");

// @route GET api/admin/wallet/request
// @desc Get users list
// @access Private
router.get("/request", [auth.Admin], getWalletRequestList);

// @route PUT api/admin/wallet/request/:wallet_request_id/update-status
// @desc Update order status by order_id
// @access Private
router.put(
  "/request/:wallet_request_id/update-status",
  [auth.Admin],
  updateWalletRequestStatusById
);

module.exports = router;
