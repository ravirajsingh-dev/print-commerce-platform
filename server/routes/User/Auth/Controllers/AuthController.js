const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const { JWT_SECRET, APP_ENV } = require("../../../../config/config");
var response = require("../../../../config/response");
const User = require("../../../../models/User");
const Order = require("../../../../models/Order");
const { comparePasswords } = require("../../../../utils/helper");

const generateToken = async (
  res,
  id,
  update_data = { last_login: Date.now() }
) => {
  let user = await User.findByIdAndUpdate(id, update_data, {
    new: true,
  })
    .select(
      "SA_ID business_name name email ccode phone ccode_phone pin_code address city state country gst_number reference_by uuid status last_login avatar terms_accepted setPassword createdAt"
    )
    .lean();

  if (!user) {
    return response.errorResponse(res, {}, "Something unexpected happend", 500);
  }

  const isNewOrder = await Order.findOne({
    user: user._id,
    status: "processing",
  });

  const payload = {
    user: {
      id: user._id,
      uuid: user.uuid,
      isNewOrder: isNewOrder?._id ? true : false,
    },
  };

  delete user["uuid"];
  jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
    if (err)
      return response.errorResponse(
        res,
        {},
        "Unable to authenticate. Please, try again later",
        500
      );

    return response.successResponse(res, { token, user }, "Login Successful");
  });
};

function handleError(res, err, debug, errMsg, statusCode) {
  if (debug) console.error(err.message || err);
  return response.errorResponse(
    res,
    statusCode ? {} : { msg: errMsg },
    errMsg || "Server Error.",
    statusCode || 500
  );
}

module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    let { email, password, token } = req.body;

    if (password && token) {
      return response.errorResponse(res, {}, "Invalid credentials.", 403);
    }

    email = email.toLowerCase();

    if (!password) {
      return response.errorResponse(res, {}, "Password is required.", 400);
    }

    const user = await User.findOne({ email }).select(
      "password last_login uuid"
    );

    if (!user || !user.password) {
      return response.errorResponse(
        res,
        { msg: "Invalid Credentials." },
        "Invalid Credentials.",
        401
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return response.errorResponse(
        res,
        { msg: "Invalid Credentials." },
        "Invalid Credentials.",
        401
      );
    }

    let updateData = { last_login: Date.now() };
    if (!user.uuid) {
      updateData.uuid = randomUUID();
    }

    generateToken(res, user._id, updateData);
  } catch (err) {
    console.error("Error during login:", err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

module.exports.logout = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return response.errorResponse(res, errors.array());
  }
  const { user } = req;
  let msg = "";
  try {
    const doc = await User.findOneAndUpdate(
      { _id: user.id, uuid: user.uuid },
      {
        uuid: randomUUID(),
      }
    );

    if (!doc) {
      msg = "Unable to logout from other devices if any.";
      return response.errorResponse(res, { msg }, msg, 401);
    }
    msg = "Logged out successfully.";
    return response.successResponse(res, {}, msg);
  } catch (err) {
    // console.log(err);
    handleError(res, err);
  }
};

module.exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select(
        "SA_ID business_name name email ccode phone ccode_phone pin_code address city state country gst_number reference_by uuid status last_login avatar terms_accepted setPassword createdAt"
      )
      .lean();

    const isNewOrder = await Order.findOne({
      user: user._id,
      status: "processing",
    });

    user.txn_password = user.txn_password ? 1 : 0;
    user.isNewOrder = isNewOrder?._id ? true : false;

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "User does not exists" },
        "User does not exists",
        404
      );
    }

    return response.successResponse(res, user, "User details");
  } catch (err) {
    console.log(err.message);
    handleError(res, err);
  }
};

module.exports.setTxnPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    const userId = req.user.id;
    if (!userId) {
      return response.errorResponse(
        res,
        { msg: "Invalid user ID" },
        "Invalid user ID",
        400
      );
    }
    const { txnPassword } = req.body;

    const user = await User.findById(userId).lean();

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "Invalid user ID" },
        "Invalid user ID",
        400
      );
    }

    const salt = await bcrypt.genSalt(10);
    const txnPasswordHash = await bcrypt.hash(txnPassword, salt);

    let updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        txn_password: txnPasswordHash,
      },
      { new: true, lean: true }
    );

    if (!updatedUser) {
      return response.errorResponse(
        res,
        { msg: "Unable to find the user" },
        "Unable to find the user",
        401
      );
    }

    return response.successResponse(
      res,
      {},
      "Set Transaction Password successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error", 403);
  }
};

module.exports.changeTxnPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array(), "Validation Error", 400);
  }
  try {
    const userId = req.user.id;

    if (!userId) {
      return response.errorResponse(
        res,
        { msg: "Invalid user ID" },
        "Invalid user ID",
        400
      );
    }

    const { oldTxnPassword, txnPassword } = req.body;

    const user = await User.findById(userId).select("_id txn_password");

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "Invalid user ID" },
        "Invalid user ID",
        400
      );
    }

    const validPassword = await comparePasswords(
      oldTxnPassword,
      user?.txn_password
    );

    if (!validPassword) {
      return response.errorResponse(
        res,
        [
          {
            path: "oldTxnPassword",
            msg: "Incorrect Tnx password. Please double-check your credentials and try again.",
          },
        ],
        "Incorrect Tnx Password.",
        400
      );
    }

    const salt = await bcrypt.genSalt(10);
    const newTxnPasswordHash = await bcrypt.hash(txnPassword, salt);

    let updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      {
        txn_password: newTxnPasswordHash,
      },
      { new: true, lean: true }
    );

    if (!updatedUser) {
      return response.errorResponse(
        res,
        { msg: "Unable to find the user" },
        "Unable to find the user",
        401
      );
    }

    return response.successResponse(
      res,
      {},
      "TxnPassword change successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error", 403);
  }
};

module.exports.updateUserProfileByID = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array(), "Validation Error", 400);
  }
  try {
    const userId = req.user.id;

    const { name, email, avatar, gender, dob } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name,
          email,
          avatar,
          gender,
          dob,
        },
      },
      { new: true }
    );

    return response.successResponse(res, user, "Profile updated successfully.");
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error", 403);
  }
};

module.exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { password, current_password } = req.body;

  try {
    const current_pass = await User.findById(req.user.id).select("password");

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

          const updatedDoc = await User.findByIdAndUpdate(
            req.user.id,
            { password: new_password, uuid: randomUUID() },
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
