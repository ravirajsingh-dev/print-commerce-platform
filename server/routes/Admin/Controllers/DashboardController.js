const response = require("../../../config/response");
const User = require("../../../models/User");
const Order = require("../../../models/Order");
const OrderItem = require("../../../models/OrderItem");

const WalletRequest = require("../../../models/WalletRequest");
const Wallet = require("../../../models/Wallet");
const moment = require("moment");
const ObjectsToCsv = require("objects-to-csv");
const fs = require("fs");

const getOrderReportData = async (dateRange) => {
  return new Promise(async (resolve) => {
    let getOrderReport = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(dateRange.startDate),
            $lte: new Date(dateRange.endDate),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "order_items",
          localField: "_id",
          foreignField: "order",
          as: "orderItem",
        },
      },
      {
        $unwind: {
          path: "$orderItem",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItem.product",
          foreignField: "_id",
          as: "orderItem.product",
        },
      },
      {
        $unwind: {
          path: "$orderItem.product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "product_services",
          localField: "orderItem.service_id",
          foreignField: "_id",
          as: "orderItem.service",
        },
      },
      {
        $unwind: {
          path: "$orderItem.service",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          order_id: 1,
          name: 1,
          order_item: "$orderItem",
          userInfo: "$userInfo",
        },
      },
    ]).collation({ locale: "en_US", strength: 1 });

    let dataArray = [];

    console.log("getOrderReport", getOrderReport);

    if (!getOrderReport.length) {
      dataArray.push({
        "User Name": "",
        "User Email": "",
        "Order ID": "",
        "Order Name": "",
        Amount: "",
        Status: "",
        "Product Name": "",
        "Service Name": "",
        Quantity: "",
        Quality: "",
        Width: "",
        Height: "",
        "Item Amount": "",
        "Role Used": "",
        Remarks: "",
      });

      return resolve(dataArray);
    }

    for (let eachOrder of getOrderReport) {
      dataArray.push({
        "User Name": eachOrder?.userInfo?.name,
        "User Email": eachOrder?.userInfo?.email,
        "Order ID": eachOrder?.order_id || "",
        "Order Name": eachOrder?.name || "",
        Amount: eachOrder?.full_amount || "",
        Status: eachOrder?.status || "",
        "Product Name": eachOrder?.orderItem?.product?.name || "",
        "Service Name": eachOrder?.orderItem?.service?.name || "",
        Quantity: eachOrder?.orderItem?.quantity || "",
        Quality: eachOrder?.orderItem?.quality || "Best Quality",
        Width: eachOrder?.orderItem?.width || "",
        Height: eachOrder?.orderItem?.height || "",
        "Item Amount": eachOrder?.orderItem?.amount || "",
        "Role Used": eachOrder?.orderItem?.role_used || "",
        Remarks: eachOrder?.orderItem?.remarks || "",
      });
    }

    return resolve(dataArray);
  });
};

const getStockReportData = async (dateRange) => {
  return new Promise(async (resolve) => {
    let getOrderReport = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(dateRange.startDate),
            $lte: new Date(dateRange.endDate),
          },
        },
      },
      {
        $lookup: {
          from: "order_items",
          localField: "_id",
          foreignField: "order",
          as: "orderItems",
        },
      },
      {
        $unwind: {
          path: "$orderItems",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          order_id: 1,
          name: 1,
        },
      },
    ]).collation({ locale: "en_US", strength: 1 });

    let dataArray = [];

    if (!getOrderReport.length) {
      dataArray.push({
        "Order ID": "",
        "Order Name": "",
        // "Order ID": "",
        // "Bar Code": "",
        // "Initial Exam Date": "",
        // "Initial Report Date": "",
        // "First Name": "",
        // "Last Name": "",
        // DOB: "",
        // SSN: "",
      });

      return resolve(dataArray);
    }

    for (let eachOrder of getOrderReport) {
      dataArray.push({
        "Order ID": eachOrder?.order_id || "",
        "Order Name": eachOrder?.name || "",
        // "Order ID": eachOrder.orderID ? eachOrder.orderID : "",
        // "Bar Code": patientBarcode,
        // "Initial Exam Date": eachOrder.scheduleDate
        //   ? moment(eachOrder.scheduleDate).format("MM/DD/YYYY HH:mm:ss")
        //   : "",
        // "Initial Report Date": eachOrder.dateAndTimeTested
        //   ? moment(eachOrder.dateAndTimeTested).format("MM/DD/YYYY HH:mm:ss")
        //   : eachOrder.results.resultedAt
        //   ? moment(eachOrder.results.resultedAt).format("MM/DD/YYYY HH:mm:ss")
        //   : "",
        // "First Name": firstName,
        // "Last Name": lastName,
        // DOB: eachOrder.patientInfo.dob
        //   ? moment(eachOrder.patientInfo.dob).format("MM/DD/YYYY")
        //   : "",
        // SSN: eachOrder.patientInfo.ssn ? eachOrder.patientInfo.ssn : "",
        // "Component Name": resultName ? resultName : "",
        // "Next Service Needed Date": nextServiceNeededDate
        //   ? moment(nextServiceNeededDate).format("MM/DD/YYYY")
        //   : "",
      });
    }

    return resolve(dataArray);
  });
};

// @desc Get dashboard details
const getDashboardDetails = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // --- EXISTING QUERIES ---
    const totalUsers = await User.countDocuments();

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    const pendingWalletRequests = await WalletRequest.countDocuments({
      status: "in_review",
    });

    const creditedAmount = await WalletRequest.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalCreditedAmount =
      creditedAmount.length > 0 ? creditedAmount[0].totalAmount : 0;

    const todaysDispatch = await Order.countDocuments({
      status: "confirmed",
    });

    const newUsers = await User.find({
      status: 3,
    });

    const todayOrderDetails = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    }).populate("user");

    // --------------------------------------------------------------
    // 🆕 1️⃣ TODAY’S TOTAL SQUARE FEET
    // --------------------------------------------------------------

    const todaySquare = await OrderItem.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
          width_feet: { $exists: true, $gt: 0 },
          height_feet: { $exists: true, $gt: 0 },
        },
      },
      {
        $project: {
          square: { $multiply: ["$width_feet", "$height_feet"] },
        },
      },
      {
        $group: { _id: null, totalSqFt: { $sum: "$square" } },
      },
    ]);

    const todaySquareFeet =
      todaySquare.length > 0 ? todaySquare[0].totalSqFt : 0;

    // --------------------------------------------------------------
    // 🆕 2️⃣ TODAY’S RECEIVED PAYMENT (CONFIRMED ORDERS)
    // --------------------------------------------------------------

    const receivedPay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
          status: "confirmed",
        },
      },
      {
        $group: { _id: null, total: { $sum: "$amount" } },
      },
    ]);

    const todayReceivedPayment =
      receivedPay.length > 0 ? receivedPay[0].total : 0;

    // --------------------------------------------------------------
    // 🆕 3️⃣ TODAY’S PENDING PAYMENT (PENDING + PROCESSING)
    // --------------------------------------------------------------

    const pendingPay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
          status: { $in: ["pending", "processing"] },
        },
      },
      {
        $group: { _id: null, total: { $sum: "$amount" } },
      },
    ]);

    const todayPendingPayment = pendingPay.length > 0 ? pendingPay[0].total : 0;

    // --------------------------------------------------------------

    const prepareData = {
      totalUsers,
      todayOrders,
      pendingOrders,
      pendingWalletRequests,
      totalCreditedAmount,
      todaysDispatch,
      newUsers,
      todayOrderDetails,

      // New Values
      todaySquareFeet,
      todayReceivedPayment,
      todayPendingPayment,
    };

    return response.successResponse(
      res,
      prepareData,
      "Dashboard details fetched successfully."
    );
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getWeeklyOrdersData = async (req, res) => {
  try {
    const dateRange = null;

    const totalUsers = await User.countDocuments();

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    const pendingWalletRequests = await WalletRequest.countDocuments({
      status: "in_review",
    });

    const creditedAmount = await WalletRequest.aggregate([
      { $match: { status: "success" } }, // Filter only successful transactions
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }, // Sum the "amount" field
    ]);

    const totalCreditedAmount =
      creditedAmount.length > 0 ? creditedAmount[0].totalAmount : 0;

    const todaysDispatch = await Order.countDocuments({
      status: "confirmed",
    });

    const prepareData = {
      totalUsers,
      todayOrders,
      pendingOrders,
      pendingWalletRequests,
      totalCreditedAmount,
      todaysDispatch,
    };

    return response.successResponse(
      res,
      prepareData,
      "Dashboard details fetched successfully."
    );
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const generateOrderReport = async (req, res) => {
  try {
    const dateRangeString = req.query.dateRange;
    const dateRangeKey = dateRangeString ? JSON.parse(dateRangeString) : null;

    let dateRange = {};

    if (dateRangeKey === "today") {
      dateRange = {
        startDate: moment().startOf("day").format(),
        endDate: moment().endOf("day").format(),
      };
    } else if (dateRangeKey === "month") {
      dateRange = {
        startDate: moment().startOf("month").format(),
        endDate: moment().endOf("month").format(),
      };
    }

    if (!dateRange) {
      return response.errorResponse(
        res,
        {},
        "Invalid Date range. Please provide valid startDate and endDate.",
        500
      );
    }

    const orderReport = await getOrderReportData(dateRange).catch((err) => {
      console.error(err);
    });
    const csvName = `order-report-${moment().format("YYYY-MM-DD HH:mm")}.csv`;
    const csvPath = `./public/uploads/${csvName}`;

    const csv = new ObjectsToCsv(orderReport);
    // Save to file:
    await csv.toDisk(csvPath);

    if (fs.existsSync(csvPath)) {
      res.download(csvPath, () => {
        // remove temp file after download
        fs.unlinkSync(csvPath);
      });
    } else {
      return response.errorResponse(res, {}, "Something went wrong.", 400);
    }
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const generateStockReport = async (req, res) => {
  try {
    const dateRangeString = req.query.dateRange;
    const dateRangeKey = dateRangeString ? JSON.parse(dateRangeString) : null;

    let dateRange = {};

    if (dateRangeKey === "today") {
      dateRange = {
        startDate: moment().startOf("day").format(),
        endDate: moment().endOf("day").format(),
      };
    } else if (dateRangeKey === "month") {
      dateRange = {
        startDate: moment().startOf("month").format(),
        endDate: moment().endOf("month").format(),
      };
    }

    if (!dateRange) {
      return response.errorResponse(
        res,
        {},
        "Invalid Date range. Please provide valid startDate and endDate.",
        500
      );
    }

    const orderReport = await getStockReportData(dateRange).catch((err) => {
      console.error(err);
    });
    const csvName = `stock-report-${moment().format("YYYY-MM-DD HH:mm")}.csv`;
    const csvPath = `./public/uploads/${csvName}`;

    const csv = new ObjectsToCsv(orderReport);
    // Save to file:
    await csv.toDisk(csvPath);

    if (fs.existsSync(csvPath)) {
      res.download(csvPath, () => {
        // remove temp file after download
        fs.unlinkSync(csvPath);
      });
    } else {
      return response.errorResponse(res, {}, "Something went wrong.", 400);
    }
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    let userStatus = status === "approve" ? 1 : 4;

    const user = await User.findByIdAndUpdate(req.params.user_id, {
      status: userStatus,
    });

    if (!user) {
      return response.errorResponse(res, {}, "User not found.", 404);
    }

    return response.successResponse(
      res,
      user,
      "User status updated successfully."
    );
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

module.exports = {
  getDashboardDetails,
  getWeeklyOrdersData,
  generateOrderReport,
  generateStockReport,
  updateUserStatus,
};
