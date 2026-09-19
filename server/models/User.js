const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    SA_ID: {
      type: String,
      unique: true,
      required: true,
      maxlength: 8,
    },
    business_name: {
      type: String,
      required: true,
      maxlength: 150,
    },
    name: {
      type: String,
      required: true,
      maxlength: 150,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      maxlength: 100,
    },
    ccode: {
      type: String,
      minlength: 1,
      maxlength: 5,
      required: true,
      default: "91",
    },
    phone: {
      type: String,
      required: true,
      maxlength: 12,
      minlength: 10,
    },
    ccode_phone: {
      type: String,
      required: true,
      unique: true,
      maxlength: 15,
      minlength: 11,
    },
    pin_code: {
      type: String,
      maxlength: 6,
      required: true,
    },
    address: {
      type: String,
      maxlength: 250,
      required: true,
    },
    city: {
      type: String,
      maxlength: 50,
      required: true,
    },
    state: {
      type: String,
      maxlength: 50,
      required: true,
    },
    country: {
      type: String,
      maxlength: 2,
      minlength: 2,
      default: "IN",
    },
    gst_number: {
      type: String,
    },
    reference_by: {
      type: String,
      maxlength: 8,
      minlength: 8,
    },
    uuid: {
      type: String,
      max: 64,
    },
    password: {
      type: String,
      required: false,
    },
    status: {
      type: Number,
      default: 1, // 1 = Active, 2 = Inactive // 3 =  New // 4  = Deleted By Admin
    },
    last_login: {
      type: Date,
    },
    avatar: {
      type: String,
    },
    terms_accepted: {
      type: Boolean,
      default: true,
    },
    setPassword: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", UserSchema);

module.exports = User;
