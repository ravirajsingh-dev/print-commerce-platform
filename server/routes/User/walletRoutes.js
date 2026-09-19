const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const {
  fetchCurrentBalanceByUserID,
  createWalletRechargeRequest,
  fetchWalletTransactionsByUserID,
  fetchWalletRequestsByUserID,
} = require("./Controllers/WalletController");
const WalletRequest = require("../../models/WalletRequest");

// @route GET api/wallets/:user_id/create
// @desc Fetch user Wallet balance by user_id
// @access Private
router.post(
  "/:user_id/create",
  auth.User,
  [
    check("amount", "Amount must be a positive number").isFloat({ min: 1 }),
    check("payment_details", "Payment details are required")
      .not()
      .isEmpty()
      .trim(),
    check("type", "Invalid payment type").isIn(["bank", "upi"]),

    check("txn_number", "Transaction number is required and must be unique")
      .not()
      .isEmpty()
      .trim()
      .custom(async (value) => {
        const upperTxnValue = value.toUpperCase();
        const existingTxn = await WalletRequest.findOne({
          txn_number: upperTxnValue,
        });

        if (existingTxn) {
          return Promise.reject(
            "This transaction number is already in use. Please enter a unique transaction number."
          );
        }
      }),

    // check("status", "Invalid status").isIn([
    //   "in_review",
    //   "success",
    //   "cancelled",
    // ]),
    // check("remarks", "Remarks should be a valid string").optional().trim(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    return createWalletRechargeRequest(req, res, next);
  }
);

// @route GET api/wallets/:user_id/balance
// @desc Fetch user Wallet balance by user_id
// @access Private
router.get("/:user_id/balance", auth.User, fetchCurrentBalanceByUserID);

// @route GET api/wallet/:user_id/transactions
// @desc Fetch user Wallet transactions by user_id
// @access Private
router.get(
  "/:user_id/transactions",
  auth.User,
  fetchWalletTransactionsByUserID
);

// @route GET api/wallet/:user_id/requests
// @desc Fetch user Wallet requests by user_id
// @access Private
router.get("/:user_id/requests", auth.User, fetchWalletRequestsByUserID);

module.exports = router;
