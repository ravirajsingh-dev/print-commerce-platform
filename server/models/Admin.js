const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      maxlength: 50,
    },

    email: {
      type: String,
      unique: true,
      required: false,
      maxlength: 50,
    },
    phone: {
      type: String,
      unique: true,
      required: false,
      maxlength: 10,
      minlength: 10,
    },
    pin_code: {
      type: String,
      maxlength: 6,
    },
    address: {
      type: String,
      maxlength: 250,
    },
    city: {
      type: String,
      maxlength: 50,
    },
    state: {
      type: String,
      maxlength: 50,
    },

    uuid: {
      type: String,
      unique: true,
      maxlength: 64,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    status: {
      type: Number,
      default: 1, // 1 = Active, 2 = Inactive
    },

    role: {
      type: Number,
      default: 1, // 1 = Admin, 2 = Sub-Admin
    },

    last_login: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("admins", AdminSchema);

module.exports = Admin;
