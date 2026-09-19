const { validationResult } = require("express-validator");
const Credential = require("../../../models/Credential");
const response = require("../../../config/response");
const Admin = require("../../../models/Admin");
const { comparePasswords } = require("../../../utils/helper");

const getCredentialsList = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    orderBy = "createdAt",
    ascending = "desc",
  } = req.query;

  const pageSize = parseInt(limit);
  const order = ascending === "desc" ? -1 : 1;
  const skip = pageSize * (page - 1);

  try {
    const userId = req.user.id;
    const user = await Admin.findById({ _id: userId }).select("_id");

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "Admin not found." },
        "Admin not found.",
        400
      );
    }

    let filterData = { user: user._id };

    const credentialsList = await Credential.aggregate([
      {
        $match: filterData,
      },
      {
        $facet: {
          metadata: [
            { $count: "totalRecord" },
            { $addFields: { current_page: page, per_page: pageSize } },
          ],
          data: [
            {
              $sort: {
                [orderBy]: order,
              },
            },
            { $skip: skip },
            { $limit: pageSize },
          ],
        },
      },
    ]);

    if (credentialsList[0].metadata.length > 0) {
      return response.successResponse(
        res,
        credentialsList,
        "Credentials List."
      );
    } else {
      return response.successResponse(
        res,
        [
          {
            metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
            data: [],
          },
        ],
        "No Credential."
      );
    }
  } catch (err) {
    console.error("Error fetching payment methods:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getCredentialsById = async (req, res) => {
  try {
    const credntialDetails = await Credential.findById(
      req.params.credential_id
    );

    console.log("credntialDetails", credntialDetails);
    if (!credntialDetails) {
      return response.errorResponse(
        res,
        { msg: "Admin Credential not found." },
        "Admin Credential not found.",
        400
      );
    }
    return response.successResponse(
      res,
      credntialDetails,
      "Admin Credential data."
    );
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const createCredential = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array(), "Validation Errors");
  }

  try {
    const userId = req.user.id;

    const user = await Admin.findById({ _id: userId }).select("_id");

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "Admin not found." },
        "Admin not found.",
        400
      );
    }

    const { type, account_number, name, ifsc, bank_name, upi } = req.body;

    // const validPassword = await comparePasswords(
    //   txn_password,
    //   user?.txn_password
    // );

    // if (!validPassword) {
    //   return response.errorResponse(
    //     res,
    //     [
    //       {
    //         path: "txn_password",
    //         msg: "Incorrect Tnx password. Please double-check your credentials and try again.",
    //       },
    //     ],
    //     "Incorrect Tnx Password.",
    //     400
    //   );
    // }

    // Ensure all existing UPIs are not primary before creating a new one

    if (type === "bank") {
      await Credential.updateMany({ user: user._id, type }, { primary: false });
    } else {
      await Credential.updateMany({ user: user._id, type }, { primary: false });
    }

    const newCredential = new Credential({
      user: user._id,
      type,
      account_number,
      name,
      ifsc,
      bank_name,
      upi,
      primary: true,
    });

    const userCredential = await newCredential.save();

    if (userCredential) {
      user.pay_method_added = true;
      await user.save();
    }

    return response.successResponse(
      res,
      userCredential,
      "Credential added successfully."
    );
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const updateCredentialById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array(), "Validation Errors");
  }

  try {
    const userId = req.user.id;

    const user = await Admin.findById({ _id: userId }).select("_id ");

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "Admin not found." },
        "Admin not found.",
        400
      );
    }

    const { primary, type } = req.body;

    // const validPassword = await comparePasswords(
    //   txn_password,
    //   user.txn_password
    // );

    // if (!validPassword) {
    //   return response.errorResponse(
    //     res,
    //     [
    //       {
    //         path: "txn_password",
    //         msg: "Incorrect Tnx password. Please double-check your credentials and try again.",
    //       },
    //     ],
    //     "Incorrect Tnx Password.",
    //     400
    //   );
    // }

    const paymentMethodFields = {
      primary: primary || false,
    };

    // if (primary) {
    //   await Credential.updateMany({ user: user._id }, { primary: false });
    // }

    if (type === "bank") {
      await Credential.updateMany({ user: user._id, type }, { primary: false });
    } else {
      await Credential.updateMany({ user: user._id, type }, { primary: false });
    }

    const userCredential = await Credential.findByIdAndUpdate(
      req.params.credential_id,
      { $set: paymentMethodFields },
      { new: true }
    );

    if (!userCredential) {
      return response.errorResponse(
        res,
        { msg: "Admin Credential not found." },
        "Admin Credential not found.",
        400
      );
    }

    // Ensure there is at least one primary Credential
    const primaryUPICount = await Credential.countDocuments({
      userID: user._id,
      primary: true,
    });
    if (primaryUPICount === 0 && !primary) {
      await Credential.findByIdAndUpdate(req.params.credential_id, {
        primary: true,
      });
    }

    return response.successResponse(
      res,
      userCredential,
      "Admin Credential updated."
    );
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const deleteUserCredentialById = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Admin.findById({ _id: userId }).select("_id");

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "Admin not found." },
        "Admin not found.",
        400
      );
    }

    // const { txn_password } = req.body;

    // const validPassword = await comparePasswords(
    //   txn_password,
    //   user.txn_password
    // );

    // if (!validPassword) {
    //   return response.errorResponse(
    //     res,
    //     [
    //       {
    //         path: "txn_password",
    //         msg: "Incorrect Tnx password. Please double-check your credentials and try again.",
    //       },
    //     ],
    //     "Incorrect Tnx Password.",
    //     400
    //   );
    // }

    const userCredential = await Credential.findById(req.params.credential_id);

    if (!userCredential) {
      return response.errorResponse(
        res,
        { msg: "Admin Credential not found." },
        "Admin Credential not found.",
        400
      );
    }

    // Check if the Credential is primary
    if (userCredential.primary) {
      return response.errorResponse(
        res,
        { msg: "Cannot delete the primary Credential." },
        "Cannot delete the primary Credential.",
        400
      );
    }

    await Credential.findByIdAndDelete(req.params.credential_id);

    return response.successResponse(
      res,
      userCredential,
      "Admin Credential deleted."
    );
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

module.exports = {
  getCredentialsList,
  getCredentialsById,
  createCredential,
  updateCredentialById,
  deleteUserCredentialById,
};
