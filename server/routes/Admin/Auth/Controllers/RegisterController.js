const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const path = require("path");

// Custom imports
const User = require("../../../../models/User");
const Wallet = require("../../../../models/Wallet");
const Credential = require("../../../../models/Credential");

const response = require("../../../../config/response");

const {
  findAvailablePosition,
  updateUserUpline,
  updateDirectSponsor,
  checkPassiveEligibilityAndGenerateLink,
  assignSenderForPassivePayment,
  createPaymentLink,
  createPaymentLinkAsLevel,
  createUserPaymentLinks,
  createUserUplinesArray,
} = require("../../../../utils/registerHelper");

const { randomUUID } = require("crypto");
const {
  formatMobileNumber,
  generateUniqueNumericCode,
} = require("../../../../utils/helper");

// Main registration function
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    const {
      name,
      phone,
      sponsorH2C,
      position,
      city,
      state,
      country,
      password,
      terms,
    } = req.body;

    const capitalH2C_ID = sponsorH2C.toUpperCase();
    const sponsorBy = await User.findOne({ H2C_ID: capitalH2C_ID });

    if (!sponsorBy || !sponsorBy.pay_method_added) {
      return response.errorResponse(
        res,
        { msg: "Sponsor UPI, Bank details, or payment status are invalid." },
        "Sponsor UPI, Bank details, or payment status are invalid.",
        400
      );
    }

    if (sponsorBy.is_root) {
      return response.errorResponse(
        res,
        { msg: "Invalid Sponser ID or Position." },
        "Invalid Sponser ID or Position.",
        400
      );
    }

    //uplineH2C  TO be pending

    const H2C_ID = generateUniqueNumericCode();

    const ccode_phone = formatMobileNumber(phone);

    const userData = {
      name,
      ccode: "+91",
      phone,
      ccode_phone,
      sponsorH2C,
      H2C_ID,
      position,
      city,
      state,
      country,
      terms_accepted: terms,
      uuid: randomUUID(),
      last_login: Date.now(),
    };

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(password, salt);

    const user = new User(userData);

    // Find the immediate available position for the new user
    const availablePosition = await findAvailablePosition(sponsorBy, position);
    const { user: uplineUser, position: assignedPosition } = availablePosition;

    if (assignedPosition === "left") {
      uplineUser.left_leg = user._id;
    } else {
      uplineUser.right_leg = user._id;
    }

    user.uplineH2C = uplineUser.H2C_ID;

    // Save registered user
    await user.save();

    // Save upline user
    await uplineUser.save();

    // Save update user uplines array
    await createUserUplinesArray(user);

    // Create welcome payment links
    createPaymentLinkAsLevel(sponsorBy, user);

    // Create a wallet for the user
    const wallet = new Wallet({
      user: user._id,
      balance: 0,
    });

    await wallet.save();

    return response.successResponse(
      res,
      {
        H2C_ID: user.H2C_ID,
        name: user.name,
      },
      "User registered successfully.",
      200
    );
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(
      res,
      { msg: err.message },
      "Server Error.",
      500
    );
  }
};

const getSponsorUserDetails = async (req, res) => {
  try {
    const H2C_ID = req.params.sponsor_id;

    // Find the user by ID
    const sponser = await User.findOne({ H2C_ID: H2C_ID }).select(
      "name pay_method_added"
    );

    // If user is not found, return error
    if (!sponser) {
      return response.errorResponse(
        res,
        [
          {
            path: "H2C_ID",
            msg: "No sponser found with H2C ID.",
          },
        ],
        "No sponser found with H2C ID.",
        404
      );
    }

    if (sponser && !sponser?.pay_method_added) {
      return response.errorResponse(
        res,
        [
          {
            path: "H2C_ID",
            msg: "Sponser's Payment method not added.",
          },
        ],
        "Sponser's Payment method not added.",
        404
      );
    }

    return response.successResponse(res, sponser, "Sponsor User details");
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

module.exports = {
  register,
  getSponsorUserDetails,
};
