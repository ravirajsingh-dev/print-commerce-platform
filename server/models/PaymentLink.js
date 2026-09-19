const mongoose = require("mongoose");
const { Schema } = mongoose;
const { generateRandomString } = require("../utils/helper");

const PaymentLinkSchema = new Schema(
  {
    HXN_ID: {
      type: String,
      required: true,
      unique: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    payment_link: {
      type: String,
    },
    qr_code: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_type: {
      type: String,
      enum: ["Direct", "Passive", "Upgrade"],
      required: true,
    },
    upgrade_level: {
      type: String,
    },
    expiry: {
      type: Date,
      required: true,
    },
    is_expired: {
      type: Boolean,
      default: false,
    },
    sender_status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      required: true,
    },
    receiver_status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      required: true,
    },
    screenshot: {
      type: String,
    },
    txnNumber: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

PaymentLinkSchema.pre("validate", async function (next) {
  if (!this.HXN_ID) {
    this.HXN_ID = await generateHXN_ID();
  }

  next();
});

const PaymentLink = mongoose.model("payment_links", PaymentLinkSchema);
module.exports = PaymentLink;

const generateHXN_ID = async () => {
  const string = generateRandomString(12);
  const newID = `HXN${string.toUpperCase()}`;

  const ifExists = await PaymentLink.find({ HXN_ID: newID }).countDocuments();
  if (ifExists) {
    return await generateHXN_ID();
  }

  return newID;
};
module.exports.generateHXN_ID = generateHXN_ID;
