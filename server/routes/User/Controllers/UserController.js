var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const User = require("../../../models/User");

const updateUserById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    const {
      business_name,
      name,
      email,
      ccode,
      phone,
      address,
      city,
      state,
      country,
      pin_code,
      gst_number,
    } = req.body;

    const ccode_phone = ccode + phone;

    const userFields = {
      business_name,
      name,
      email,
      ccode,
      phone,
      ccode_phone,
      address,
      city,
      state,
      country,
      pin_code,
      gst_number,
    };

    const user = await User.findByIdAndUpdate(
      { _id: req.params.user_id },
      { $set: userFields },
      { new: true }
    )
      .select("-password -setPassword")
      .lean();

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "User not found." },
        "User not found.",
        400
      );
    }

    return response.successResponse(res, user, "User Updated.");
  } catch (err) {
    // console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const changeUserPasswordByID = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    var new_password = await bcrypt.hash(password, salt);

    const updatedDoc = await User.findByIdAndUpdate(
      req.params.user_id,
      { password: new_password, uuid: uuid(16) },
      { new: true }
    );

    if (!updatedDoc) {
      return response.errorResponse(
        res,
        {},
        "Something unexpected happend. Unable to update password.",
        500
      );
    }

    return response.successResponse(
      res,
      updatedDoc,
      "User password updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

module.exports = {
  updateUserById,
  changeUserPasswordByID,
};
