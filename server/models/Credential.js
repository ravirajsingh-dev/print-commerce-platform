const mongoose = require("mongoose");
const { Schema } = mongoose;

const CredentialSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["bank", "upi"],
      required: true,
      index: true,
    },
    bank_name: {
      type: String,
    },
    ifsc: {
      type: String,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    account_number: {
      type: String,
      index: true,
    },
    upi: {
      type: String,
      required: false,
    },
    primary: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Credential = mongoose.model("credentials", CredentialSchema);

module.exports = Credential;
