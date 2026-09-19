var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const initEmail = require("../../../Notifications/Emails/email");
const { APP_PORTAL_URL } = require("../../../config/config");

const User = require("../../../models/User");
const { processSearchFilters } = require("../../../utils/searchHelper");
const Wallet = require("../../../models/Wallet");
const { generateUniqueSAID } = require("../../../utils/helper");

const getUsersList = async (req, res) => {
  const {
    limit = 20,
    page = 1,
    orderBy = "createdAt",
    ascending = "desc",
  } = req.query;

  let { filters = [], query = {} } = req.query;

  const pageSize = parseInt(limit);
  const order = ascending === "desc" ? -1 : 1;
  const skip = pageSize * (page - 1);

  try {
    // Process filters using the helper function
    const filtersArgs = processSearchFilters(filters, query);

    const usersList = await User.aggregate([
      { $match: filtersArgs },
      {
        $project: {
          SA_ID: 1,
          business_name: 1,
          name: 1,
          email: 1,
          ccode: 1,
          phone: 1,
          ccode_phone: 1,
          address: 1,
          pin_code: 1,
          city: 1,
          state: 1,
          country: 1,
          gst_number: 1,
          reference_by: 1,
          setPassword: 1,
          status: 1,
          last_login: 1,
          createdAt: 1,
        },
      },
      {
        $facet: {
          metadata: [
            { $count: "totalRecord" },
            { $addFields: { current_page: page, per_page: pageSize } },
          ],
          data: [
            { $sort: { [orderBy]: order } },
            { $skip: skip },
            { $limit: pageSize },
          ],
        },
      },
    ]).collation({ locale: "en_US", strength: 1 });

    if (usersList[0].metadata.length > 0) {
      return response.successResponse(res, usersList, "Users List.");
    } else {
      return response.successResponse(
        res,
        [
          {
            metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
            data: [],
          },
        ],
        "No Users."
      );
    }
  } catch (err) {
    console.error("Error fetching users list:", err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const createUser = async (req, res) => {
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
      reference_by,
    } = req.body;

    const ccode_phone = ccode + phone;
    const password = randomstring.generate(8);
    const SA_ID = generateUniqueSAID();

    let user = new User({
      SA_ID,
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
      reference_by,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.setPassword = true; // to ask for set new password on first login.

    const user_doc = await user.save();
    if (!user_doc) {
      return response.errorResponse(
        res,
        "Oops, something went wrong. Unable to add user.",
        500
      );
    }

    // return success
    let create_msg = "user created.";

    const userData = {
      name: user_doc?.name,
      email: user_doc?.email,
      password: password,
      login_link: APP_PORTAL_URL,
    };

    // Create a wallet for the user
    const wallet = new Wallet({
      user: user_doc._id,
      balance: 0,
    });

    await wallet.save();

    if (email) {
      await initEmail("user-welcome-email", userData);

      create_msg = `user created and verification e-mail sent to the ${email}`;
    }

    return response.successResponse(res, { _id: user_doc._id }, create_msg);
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const createUserRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    const {
      business_name,
      name,
      email,
      phone,
      address,
      city,
      state,
      country,
      pin_code,
      gst_number,
      reference_by,
    } = req.body;

    const ccode = "+91";
    const ccode_phone = ccode + phone;
    const SA_ID = generateUniqueSAID();

    let user = new User({
      SA_ID,
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
      reference_by,
      status: 3,
    });

    user.setPassword = true; // to ask for set new password on first login.

    const user_doc = await user.save();
    if (!user_doc) {
      return response.errorResponse(
        res,
        "Oops, something went wrong. Unable to add user.",
        500
      );
    }

    return response.successResponse(res, {}, "Request Successfully Submitted");
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.user_id })
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

    return response.successResponse(res, user, "User data.");
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return response.errorResponse(
        res,
        { msg: "User not found." },
        "User not found.",
        400
      );
    }
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

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
      reference_by,
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
      reference_by,
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

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.user_id,
    }).select("_id");

    return response.successResponse(res, user, "User deleted.");
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const updateUserStatusById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.user_id,
      {
        $set: { status, lastEditedBy: req.user.id },
      },
      {
        new: true,
      }
    );

    if (!user) {
      return response.errorResponse(res, {}, "User not found.", 400);
    }

    return response.successResponse(
      res,
      user,
      "User status updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const activationNewUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    const { user_id } = req.params;
    const password = randomstring.generate(8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user fields
    const updatedDoc = await User.findByIdAndUpdate(
      user_id,
      {
        status: 1,
        password: hashedPassword,
      },
      { new: true }
    )
      .select("-password -setPassword")
      .lean();

    if (!updatedDoc) {
      return response.errorResponse(
        res,
        {},
        "Failed to activate user. Please try again.",
        500
      );
    }

    // Create a wallet for the user
    const wallet = new Wallet({
      user: updatedDoc._id,
      balance: 0,
    });

    const userData = {
      name: updatedDoc.name,
      email: updatedDoc.email,
      password,
      login_link: APP_PORTAL_URL,
    };

    let message = "User activated successfully.";

    // Send email only if the user has an email
    if (updatedDoc.email) {
      await Promise.all([
        wallet.save(),
        initEmail("user-welcome-email", userData),
      ]);

      message = `User created and verification email sent to ${updatedDoc.email}`;
    } else {
      await wallet.save();
    }

    return response.successResponse(res, updatedDoc, message);
  } catch (err) {
    console.error("Activation Error:", err);
    return response.errorResponse(
      res,
      {},
      "Server Error. Please try again.",
      500
    );
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
  getUsersList,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserStatusById,
  changeUserPasswordByID,
  createUserRequest,
  activationNewUser,
};
