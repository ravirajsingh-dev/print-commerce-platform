const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define transaction schema
const walletTransactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  wallet: {
    type: Schema.Types.ObjectId,
    ref: "wallets",
    required: true,
  },
  type: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  balanceAfterTransaction: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
    immutable: true,
  },
});

const WalletTransaction = mongoose.model(
  "wallet_transactions",
  walletTransactionSchema
);

module.exports = WalletTransaction;
