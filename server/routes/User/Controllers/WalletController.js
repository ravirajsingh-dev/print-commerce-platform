const { validationResult } = require("express-validator");
var response = require("../../../config/response");

const User = require("../../../models/User");
const Wallet = require("../../../models/Wallet");
const WalletRequest = require("../../../models/WalletRequest");
const WalletTransaction = require("../../../models/WalletTransaction");
const { processSearchFilters } = require("../../../utils/searchHelper");

const fetchCurrentBalanceByUserID = async (req, res) => {
  try {
    const userID = req.params.user_id;

    const user = await User.findById(userID).select("_id");
    if (!user) {
      return response.errorResponse(
        res,
        { msg: "User not found." },
        "User not found.",
        400
      );
    }

    const wallet = await Wallet.findOne({ user: user._id })
      .select("currentBalance")
      .lean();

    if (!wallet) {
      return response.errorResponse(
        res,
        { msg: "Wallet not found." },
        "Wallet not found.",
        400
      );
    }

    const walletTransactions = await WalletTransaction.find({ user: user._id });

    let debitedAmount = 0;
    let creditedAmount = 0;

    walletTransactions.map((eachTxn) =>
      eachTxn.type === "debit" ? (debitedAmount += eachTxn?.amount) : 0
    );

    walletTransactions.map((eachTxn) =>
      eachTxn.type === "credit" ? (creditedAmount += eachTxn?.amount) : 0
    );

    prepapreData = {
      ...wallet,
      debitedAmount,
      creditedAmount,
    };

    return response.successResponse(
      res,
      prepapreData,
      "Fetch currentBalance Successfully."
    );
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const fetchWalletTransactionsByUserID = async (req, res) => {
  const {
    limit = 20,
    page = 1,
    orderBy = "createdAt",
    ascending = "desc",
  } = req.query;

  console.log("req.query", req.query);

  let { filters = [], query = {} } = req.query;

  const pageSize = parseInt(limit);
  const order = ascending === "desc" ? -1 : 1;
  const skip = pageSize * (page - 1);

  try {
    const userID = req.params.user_id;

    // Check if the user exists
    const user = await User.findById(userID).select("_id").lean();
    if (!user) {
      return response.errorResponse(
        res,
        { msg: "User not found." },
        "User not found.",
        400
      );
    }

    // Process filters
    const filtersArgs = processSearchFilters(filters, query);

    const matchStage = { $match: { ...filtersArgs, user: user._id } };

    const transactionsList = await WalletTransaction.aggregate([
      matchStage,
      {
        $project: {
          _id: 1,
          user: 1,
          wallet: 1,
          type: 1,
          amount: 1,
          balanceAfterTransaction: 1,
          description: 1,
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

    if (transactionsList[0].metadata.length > 0) {
      return response.successResponse(
        res,
        transactionsList,
        "Wallet Transactions List."
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
        "No Wallet Transactions."
      );
    }
  } catch (err) {
    console.error("Error fetching wallet transactions:", err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const fetchWalletRequestsByUserIDss = async (req, res) => {
  try {
    const userID = req.params.user_id;

    const user = await User.findById(userID).select("_id");
    if (!user) {
      return response.errorResponse(
        res,
        { msg: "User not found." },
        "User not found.",
        400
      );
    }

    const walletRequests = await WalletRequest.find({
      user: user._id,
    }).sort({ createdAt: -1 });

    if (!walletRequests || walletRequests.length === 0) {
      return response.errorResponse(
        res,
        { msg: "No wallet requests found." },
        "No wallet requests found.",
        400
      );
    }

    return response.successResponse(
      res,
      walletRequests,
      "Fetched wallet requests successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const fetchWalletRequestsByUserID = async (req, res) => {
  const {
    limit = 20,
    page = 1,
    orderBy = "createdAt",
    ascending = "desc",
  } = req.query;

  console.log("req.query", req.query);

  let { filters = [], query = {} } = req.query;

  const pageSize = parseInt(limit);
  const order = ascending === "desc" ? -1 : 1;
  const skip = pageSize * (page - 1);

  try {
    const userID = req.params.user_id;

    // Check if the user exists
    const user = await User.findById(userID).select("_id").lean();
    if (!user) {
      return response.errorResponse(
        res,
        { msg: "User not found." },
        "User not found.",
        400
      );
    }

    // Process filters
    const filtersArgs = processSearchFilters(filters, query);

    const matchStage = { $match: { ...filtersArgs, user: user._id } };

    const transactionsList = await WalletRequest.aggregate([
      matchStage,
      {
        $project: {
          _id: 1,
          user: 1,
          amount: 1,
          payment_details: 1,
          type: 1,
          txn_number: 1,
          status: 1,
          remarks: 1,
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

    if (transactionsList[0].metadata.length > 0) {
      return response.successResponse(
        res,
        transactionsList,
        "Wallet Transactions List."
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
        "No Wallet Transactions."
      );
    }
  } catch (err) {
    console.error("Error fetching wallet transactions:", err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const createWalletRechargeRequest = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const { amount, payment_details, type, txn_number, remarks } = req.body;

    // Validate user existence
    const user = await User.findById(userID).select("_id").lean();
    if (!user) {
      return response.errorResponse(
        res,
        { msg: "User not found." },
        "User not found.",
        400
      );
    }

    // Create Wallet Request
    const walletRequest = new WalletRequest({
      user: user._id,
      amount,
      payment_details,
      type,
      txn_number,
      status: "in_review",
      remarks,
    });

    await walletRequest.save();

    return response.successResponse(
      res,
      walletRequest,
      "Wallet recharge request created successfully."
    );
  } catch (err) {
    console.error("Error in createWalletRechargeRequest:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

module.exports = {
  fetchCurrentBalanceByUserID,
  createWalletRechargeRequest,
  fetchWalletTransactionsByUserID,
  fetchWalletRequestsByUserID,
};
