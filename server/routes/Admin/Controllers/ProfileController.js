var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../config/config");

const Admin = require("../../../models/Admin");

const changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return await response.errorResponse(res, errors.array());
  }

  const { password, current_password } = req.body;

  try {
    const current_pass = await Admin.findById(req.user.id).select("password");

    bcrypt.compare(
      current_password,
      current_pass.password,
      async function (error, success) {
        if (error || !success)
          return response.errorResponse(
            res,
            { msg: "Current Password is wrong." },
            "Current Password is wrong.",
            401,
            false
          );
        if (success) {
          const salt = await bcrypt.genSalt(10);
          var new_password = await bcrypt.hash(password, salt);

          const updatedDoc = await Admin.findByIdAndUpdate(
            req.user.id,
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

          const payload = {
            user: {
              id: req.user.id,
              uuid: updatedDoc.uuid,
            },
          };
          jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
            if (err) throw err;

            return response.successResponse(
              res,
              { token, user: updatedDoc },
              "Password Changed."
            );
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const updateUserProfileById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { name, email, ccode, phone, address, state, city, pin_code } =
    req.body;

  const ccode_phone = ccode + phone;

  const userFields = {
    name,
    email,
    phone,
    ccode,
    ccode_phone,
    address,
    state,
    city,
    pin_code,
  };

  try {
    const user = await Admin.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    );

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "Admin not found." },
        "Admin not found.",
        400
      );
    }

    return response.successResponse(res, user, "Admin profile updated.");
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const saveUserProfileImage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return response.errorResponse(res, errors.array());
    }

    const { userProfile } = req.body;
    const user_id = req.user.id;

    const user = await Admin.findByIdAndUpdate(
      user_id,
      {
        $set: { avatar: userProfile },
      },
      { new: true }
    );

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "Admin not found." },
        "Admin not found.",
        400
      );
    }

    return response.successResponse(res, user, "Profile updated", 200);
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

module.exports = {
  changePassword,
  updateUserProfileById,
  saveUserProfileImage,
};
