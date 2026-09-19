const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");

const {
  getOrdersList,
  createOrder,
  getOrderById,
  updateOrderStatusById,
  getOrdersListAll,
  getOrderStatusList,
  getOrderInvoiceByID,
} = require("./Controllers/OrderController");

// @route GET api/admin/orders/list
// @desc Get orders list
// @access Private
router.get("/list", [auth.User], getOrdersList);

// @route GET api/admin/orders/list-all
// @desc Get orders list all
// @access Private
router.get("/list-all", [auth.User], getOrdersListAll);

// @route POST api/admin/order
// @desc Create Order
// @access Private
router.post(
  "/",
  [
    auth.User,
    [check("name", "Please provide the Name").not().trim().isEmpty()],
  ],
  createOrder
);

// @route GET api/admin/orders/:order_id
// @desc Get order by order_id
// @access Private
router.get("/:order_id/track-order", [auth.User], getOrderStatusList);

// @route GET api/admin/orders/:order_id/generate-invoice
// @desc Generate order invoice by order_id
// @access Private
router.get("/:order_id/generate-invoice", [auth.User], getOrderInvoiceByID);

// @route GET api/admin/orders/:order_id
// @desc Get order by order_id
// @access Private
router.get("/:order_id", [auth.User], getOrderById);

// @route PUT api/admin/orders/:order_id/update-satus
// @desc Update order status by order_id
// @access Private
router.put("/:order_id/update-status", [auth.User], updateOrderStatusById);

module.exports = router;
