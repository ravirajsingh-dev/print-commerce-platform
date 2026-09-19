var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const { processSearchFilters } = require("../../../utils/searchHelper");
const WalletRequest = require("../../../models/WalletRequest");
const Wallet = require("../../../models/Wallet");
const Order = require("../../../models/Order");

const getWalletRequestList = async (req, res) => {
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

    const walletRequestList = await WalletRequest.aggregate([
      { $match: filtersArgs },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          amount: 1,
          payment_details: 1,
          type: 1,
          txn_number: 1,
          remarks: 1,
          status: 1,
          createdAt: 1,
          "userDetails.name": 1,
          "userDetails.SA_ID": 1,
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

    if (walletRequestList[0].metadata.length > 0) {
      return response.successResponse(
        res,
        walletRequestList,
        "Wallet Request List."
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
        "No Wallet Request."
      );
    }
  } catch (err) {
    console.error("Error fetching users list:", err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const updateWalletRequestStatusById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { status, reasonForCancel } = req.body;

  try {
    // Find the wallet request
    const walletRequest = await WalletRequest.findById(
      req.params.wallet_request_id
    );
    if (!walletRequest) {
      return response.errorResponse(res, {}, "Wallet request not found.", 400);
    }

    // Prevent unnecessary updates
    if (walletRequest.status === "success") {
      return response.errorResponse(
        res,
        {},
        "Wallet request already processed.",
        400
      );
    }

    // Prepare remarks based on status
    let remarks = walletRequest.remarks;
    if (status === "success") {
      remarks = `Wallet credited with ₹${walletRequest.amount}, Transaction ID: ${walletRequest.txn_number}`;
    } else if (status === "cancelled") {
      remarks = `Wallet request of ₹${walletRequest.amount} with Transaction ID: ${walletRequest.txn_number} has been cancelled.`;
    }

    // Update wallet request status and remarks
    walletRequest.status = status;
    walletRequest.remarks = remarks;
    walletRequest.reasonForCancel = reasonForCancel ? reasonForCancel : "s";
    await walletRequest.save();

    // If status is "success", credit the amount to the user's wallet
    if (status === "success") {
      const wallet = await Wallet.findOne({ user: walletRequest.user });
      if (!wallet) {
        return response.errorResponse(res, {}, "User wallet not found.", 400);
      }

      // Add transaction and update wallet balance
      await wallet.addTransaction(
        "credit",
        walletRequest.amount,
        `Wallet credited with ₹${walletRequest.amount}, Transaction ID: ${walletRequest.txn_number}`
      );
    }

    //Check order for confirmed
    const orders = await Order.find({
      user: walletRequest.user,
      status: "processing",
    }).sort({ createdAt: -1 });

    orders.forEach(async (eachOrder) => {
      const orderAmount = eachOrder.full_amount;
      const wallet = await Wallet.findOne({
        user: walletRequest.user,
      });
      if (wallet?.balance > orderAmount) {
        await Order.findByIdAndUpdate(eachOrder._id, {
          $set: "confirmed",
        });

        // Add transaction and update wallet balance
        await wallet.addTransaction(
          "debit",
          orderAmount,
          `Wallet debited with ₹${orderAmount} for Order : ${eachOrder.order_id}`
        );
      }
    });

    return response.successResponse(
      res,
      walletRequest,
      "Wallet request status updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

module.exports = {
  getWalletRequestList,
  updateWalletRequestStatusById,
};
