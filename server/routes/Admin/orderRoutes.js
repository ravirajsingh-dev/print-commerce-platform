const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");

const Order = require("../../models/Order");

const {
  getOrdersList,
  createOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  updateOrderStatusById,
  changeOrderPasswordByID,
} = require("./Controllers/OrderController");

// @route GET api/admin/orders/list
// @desc Get orders list
// @access Private
router.get("/list", [auth.Admin], getOrdersList);

// @route POST api/admin/order
// @desc Create Order
// @access Private
router.post(
  "/",
  [
    auth.Admin,
    [check("user", "Please provide the user").not().trim().isEmpty()],
  ],
  createOrder
);

// @route GET api/admin/orders/:order_id
// @desc Get order by order_id
// @access Private
router.get("/:order_id", [auth.Admin], getOrderById);

// @route PUT api/admin/orders/:order_id/update-satus
// @desc Update order status by order_id
// @access Private
router.put("/:order_id/update-status", [auth.Admin], updateOrderStatusById);

// @route POST api/admin/orders/:order_id
// @desc Edit order profile by order_id
// @access Private
router.put(
  "/:order_id",
  [
    auth.Admin,
    [
      check("name", "Please provide the name")
        .not()
        .trim()
        .isEmpty()
        .isLength({ max: 100 })
        .withMessage("The Name must be maximum 100 chars long"),
    ],
  ],
  updateOrderById
);

// @route DELETE api/admin/orders/:order_id
// @desc Delete order by order_id
// @access Private
router.delete("/:order_id", [auth.Admin], deleteOrderById);

module.exports = router;
