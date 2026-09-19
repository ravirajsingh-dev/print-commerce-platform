const mongoose = require("mongoose");
const { Schema } = mongoose;
const WalletTransaction = require("./WalletTransaction");

// Define wallet schema
const walletSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    currentBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

walletSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

walletSchema.methods.addTransaction = async function (
  type,
  amount,
  description
) {
  if (type === "debit" && this.currentBalance < amount) {
    throw new Error("Insufficient funds");
  }

  const balanceAfterTransaction =
    type === "credit"
      ? this.currentBalance + amount
      : this.currentBalance - amount;

  // Create a new transaction record
  const transaction = new WalletTransaction({
    user: this.user,
    wallet: this._id,
    type,
    amount,
    balanceAfterTransaction,
    description,
  });

  // Save the transaction and update the wallet balance
  await transaction.save();
  this.currentBalance = balanceAfterTransaction;
  await this.save();
};

const Wallet = mongoose.model("wallets", walletSchema);

module.exports = Wallet;
