const { validationResult } = require("express-validator");
const Complaint = require("../../../models/Complaint");
const response = require("../../../config/response");
const Admin = require("../../../models/Admin");
const User = require("../../../models/User");

const getComplaintsList = async (req, res) => {
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

    const complaintsList = await Complaint.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
        },
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

    if (complaintsList[0].metadata.length > 0) {
      return response.successResponse(res, complaintsList, "Complaints List.");
    } else {
      return response.successResponse(
        res,
        [
          {
            metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
            data: [],
          },
        ],
        "No Complaint."
      );
    }
  } catch (err) {
    console.error("Error fetching payment methods:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getComplaintsById = async (req, res) => {
  try {
    const credntialDetails = await Complaint.findById(req.params.complaint_id);

    if (!credntialDetails) {
      return response.errorResponse(
        res,
        { msg: "Admin Complaint not found." },
        "Admin Complaint not found.",
        400
      );
    }

    const user = await User.findById(credntialDetails.user).select(
      "SA_ID name"
    );

    const complaintRes = {
      ...credntialDetails.toObject(),
      userName: user?.name,
      SA_ID: user?.SA_ID,
    };

    return response.successResponse(res, complaintRes, "Admin Complaint data.");
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const createComplaint = async (req, res) => {
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
    //         msg: "Incorrect Tnx password. Please double-check your complaints and try again.",
    //       },
    //     ],
    //     "Incorrect Tnx Password.",
    //     400
    //   );
    // }

    // Ensure all existing UPIs are not primary before creating a new one

    if (type === "bank") {
      await Complaint.updateMany({ user: user._id, type }, { primary: false });
    } else {
      await Complaint.updateMany({ user: user._id, type }, { primary: false });
    }

    const newComplaint = new Complaint({
      user: user._id,
      type,
      account_number,
      name,
      ifsc,
      bank_name,
      upi,
      primary: true,
    });

    const userComplaint = await newComplaint.save();

    if (userComplaint) {
      user.pay_method_added = true;
      await user.save();
    }

    return response.successResponse(
      res,
      userComplaint,
      "Complaint added successfully."
    );
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const updateComplaintById = async (req, res) => {
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
    //         msg: "Incorrect Tnx password. Please double-check your complaints and try again.",
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
    //   await Complaint.updateMany({ user: user._id }, { primary: false });
    // }

    if (type === "bank") {
      await Complaint.updateMany({ user: user._id, type }, { primary: false });
    } else {
      await Complaint.updateMany({ user: user._id, type }, { primary: false });
    }

    const userComplaint = await Complaint.findByIdAndUpdate(
      req.params.complaint_id,
      { $set: paymentMethodFields },
      { new: true }
    );

    if (!userComplaint) {
      return response.errorResponse(
        res,
        { msg: "Admin Complaint not found." },
        "Admin Complaint not found.",
        400
      );
    }

    // Ensure there is at least one primary Complaint
    const primaryUPICount = await Complaint.countDocuments({
      userID: user._id,
      primary: true,
    });
    if (primaryUPICount === 0 && !primary) {
      await Complaint.findByIdAndUpdate(req.params.complaint_id, {
        primary: true,
      });
    }

    return response.successResponse(
      res,
      userComplaint,
      "Admin Complaint updated."
    );
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const deleteUserComplaintById = async (req, res) => {
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
    //         msg: "Incorrect Tnx password. Please double-check your complaints and try again.",
    //       },
    //     ],
    //     "Incorrect Tnx Password.",
    //     400
    //   );
    // }

    const userComplaint = await Complaint.findById(req.params.complaint_id);

    if (!userComplaint) {
      return response.errorResponse(
        res,
        { msg: "Admin Complaint not found." },
        "Admin Complaint not found.",
        400
      );
    }

    // Check if the Complaint is primary
    if (userComplaint.primary) {
      return response.errorResponse(
        res,
        { msg: "Cannot delete the primary Complaint." },
        "Cannot delete the primary Complaint.",
        400
      );
    }

    await Complaint.findByIdAndDelete(req.params.complaint_id);

    return response.successResponse(
      res,
      userComplaint,
      "Admin Complaint deleted."
    );
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const updateComplaintStatusById = async (req, res) => {
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

    const userComplaint = await Complaint.findByIdAndUpdate(
      req.params.complaint_id,
      { $set: { status: "Completed" } },
      { new: true }
    );

    if (!userComplaint) {
      return response.errorResponse(
        res,
        { msg: "Admin Complaint not found." },
        "Admin Complaint not found.",
        400
      );
    }

    return response.successResponse(res, userComplaint, "Status updated.");
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

module.exports = {
  getComplaintsList,
  getComplaintsById,
  createComplaint,
  updateComplaintById,
  deleteUserComplaintById,
  updateComplaintStatusById,
};
