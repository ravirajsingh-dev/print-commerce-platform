var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");
const {
  generateInvoice,
} = require("../../../customClasses/invoice/generateInvoice");

const User = require("../../../models/User");
const Order = require("../../../models/Order");
const OrderItem = require("../../../models/OrderItem");
const OrderStatus = require("../../../models/OrderStatus");

const { generateUniqueNumericCode } = require("../../../utils/helper");
const Admin = require("../../../models/Admin");

const getOrdersList = async (req, res) => {
  const {
    limit = 20,
    page = 1,
    orderBy = "createdAt",
    ascending = "desc",
  } = req.query ? req.query : req.body;

  let { filters = "", query = "" } = req.query.limit ? req.query : req.body;

  // let regEx = new RegExp(query, 'i');

  var pageSize = parseInt(limit);
  var order = ascending === "desc" ? -1 : 1;
  const skip = pageSize * (page - 1);
  let filtersArgs = {};
  let filtersArgs2 = {};
  let filtersFilterArgs = {};
  let filtersSearchArgs = {};
  let orSearch = [];
  let orFilter = [];

  console.log("filters", filters, query);
  try {
    filters.forEach(async (item) => {
      if (typeof query === "object" && query[item]) {
        if (item === "search") {
          let orderFilers = query[item];
          for (let i in orderFilers) {
            const value = orderFilers[i].value;

            if (i === "role") {
              orSearch.push({
                [i]: value.match(/admin/i) ? 2 : value.match(/order/i) ? 1 : "",
              });
            } else {
              switch (orderFilers[i].type) {
                case "id":
                  orSearch.push({ [i]: mongoose.Types.ObjectId(value) });
                  break;
                case "Number":
                  orSearch.push({
                    [i]: {
                      $regex: new RegExp(parseInt(orderFilers[i].value), "i"),
                    },
                  });
                  break;
                case "String":
                  orSearch.push({
                    [i]: {
                      $regex: new RegExp(orderFilers[i].value.toString(), "i"),
                    },
                  });
                  break;
                case "Array":
                  orSearch.push({
                    [i]: {
                      $in: [orderFilers[i].value.toString()],
                    },
                  });
                  break;
                default:
                  orSearch.push({ [i]: value });
              }
            }
          }
          filtersSearchArgs = {
            $or: orSearch,
          };
        } else if (item !== "search-team") {
          const value = query[item].value;

          switch (query[item].type) {
            case "id":
              orFilter.push({ [item]: new mongoose.Types.ObjectId(value) });
              break;
            case "Number":
              orFilter.push({ [item]: parseInt(value) });
              break;
            case "String":
              orFilter.push({ [item]: value.toString() });
              break;
            case "Date":
              orFilter.push({
                [item]: {
                  $gte: new Date(value.split("-")[0]),
                  $lte: new Date(value.split("-")[1]),
                },
              });
              break;
            case "Boolean":
              orFilter.push({
                [item]: value === "1" ? true : false,
              });
              break;
            case "Leg":
              if (value === "completed") {
                orFilter.push({
                  left_leg: { $ne: null },
                });
                orFilter.push({
                  right_leg: { $ne: null },
                });
              } else {
                orFilter.push({
                  $or: [
                    { left_leg: { $eq: null } },
                    { right_leg: { $eq: null } },
                  ],
                });
              }
              break;
            default:
              orFilter.push({ [item]: value });
          }
          if (orFilter.length) {
            filtersFilterArgs = {
              $and: orFilter,
            };
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
    if (typeof query === "object" || typeof query === "array") query = "";
    const regEx = new RegExp(query, "i");
  }

  filtersArgs = Object.assign(
    { user: new mongoose.Types.ObjectId(req.user.id) },
    filtersFilterArgs,
    filtersSearchArgs
  );

  console.log("filtersArgs", filtersArgs);

  try {
    let ordersList = await Order.aggregate([
      {
        $match: filtersArgs,
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
        $match: filtersArgs2,
      },
      {
        $project: {
          name: 1,
          order_id: 1,
          userInfo: {
            name: "$userInfo.name",
          },
          amount: 1,
          full_amount: 1,
          status: 1,
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
    ]).collation({ locale: "en_US", strength: 1 });

    if (ordersList[0].metadata.length > 0) {
      return response.successResponse(res, ordersList, "Orders  List.");
    } else {
      ordersList = [
        {
          metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
          data: [],
        },
      ];
      return response.successResponse(res, ordersList, "No Orders.");
    }
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    const { name, amount, full_amount, order_items } = req.body;

    const order_id = await generateUniqueNumericCode("ORD");

    let order = new Order({
      user: req.user.id,
      name,
      amount,
      full_amount,
      order_id,
    });

    const order_doc = await order.save();

    if (!order_doc) {
      return response.errorResponse(
        res,
        "Oops, something went wrong. Unable to add order.",
        500
      );
    }

    const orderStatus = new OrderStatus({
      order: order_doc._id,
    });

    await orderStatus.save();

    order_items.forEach(async (eachItem) => {
      let item = new OrderItem({
        order: order?._id,
        product: eachItem.product,
        service_id: eachItem.service_id,
        category_id: eachItem.category_id,
        quantity: eachItem.quantity,
        quality: eachItem.quality,
        width: eachItem.width,
        height: eachItem.height,
        amount: eachItem.amount,
        remarks: eachItem.remarks,
        lamination: eachItem.lamination,
      });

      await item.save();
    });

    return response.successResponse(
      res,
      { _id: order_doc._id },
      "Order created."
    );
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderDetails = await Order.findById(req.params.order_id).lean();

    if (!orderDetails) {
      return response.errorResponse(
        res,
        { msg: "Order not found." },
        "Order not found.",
        400
      );
    }

    const orderItems = await OrderItem.aggregate([
      {
        $match: {
          order: new mongoose.Types.ObjectId(req.params.order_id),
        },
      },
      // {
      //   $lookup: {
      //     from: "order_items",
      //     localField: "_id",
      //     foreignField: "order",
      //     as: "orderItems",
      //   },
      // },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: {
          path: "$productInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "product_services",
          localField: "service_id",
          foreignField: "_id",
          as: "serviceInfo",
        },
      },
      {
        $unwind: {
          path: "$serviceInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          product: "$productInfo",
          service: "$serviceInfo",
          service_id: 1,
          quantity: 1,
          quality: 1,
          width: 1,
          height: 1,
          amount: 1,
          remarks: 1,
          lamination: 1,
        },
      },
    ]).collation({ locale: "en_US", strength: 1 });

    const prepareData = {
      ...orderDetails,
      order_items: orderItems,
    };

    return response.successResponse(res, prepareData, "Order data.");
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return response.errorResponse(
        res,
        { msg: "Order not found." },
        "Order not found.",
        400
      );
    }
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const updateOrderById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { name, title, email, ccode, phone, role } = req.body;

  const ccode_phone = ccode + phone;

  const orderFields = {
    name,
    title,
    email,
    phone,
    ccode,
    ccode_phone,
    role,
    lastEditedBy: req.order.id,
  };

  try {
    const order = await Order.findByIdAndUpdate(
      { _id: req.params.order_id },
      { $set: orderFields },
      { new: true }
    )
      .select("-password -setPassword")
      .lean();

    if (!order) {
      return response.errorResponse(
        res,
        { msg: "Order not found." },
        "Order not found.",
        400
      );
    }

    return response.successResponse(res, order, "Order Updated.");
  } catch (err) {
    // console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const updateOrderStatusById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { status, reasonForCancel } = req.body;

  try {
    const orderDetails = await Order.findById(req.params.order_id);

    if (!orderDetails) {
      return response.errorResponse(
        res,
        { msg: "Order not found." },
        "Order not found.",
        400
      );
    }

    const order = await Order.findByIdAndUpdate(
      req.params.order_id,
      {
        $set: {
          status: status,
          reasonForCancel: reasonForCancel,
          lastEditedBy: req.user.id,
        },
      },
      {
        new: true,
      }
    );

    const orderStatus = new OrderStatus({
      order: req.params.order_id,
      status: status,
      updatedBy: req.user.id,
      reasonForCancel,
    });

    await orderStatus.save();

    return response.successResponse(
      res,
      order,
      "Order status updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getOrdersListAll = async (req, res) => {
  try {
    const ordersList = await Order.find({
      user: req.user.id,
      status: { $ne: "cancelled" },
    }).sort({ createdAt: -1 });

    return response.successResponse(res, ordersList, "User orders list all.");
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getOrderStatusList = async (req, res) => {
  try {
    const orderStatusList = await OrderStatus.find({
      order: req.params.order_id,
    }).populate("updatedBy");

    return response.successResponse(
      res,
      orderStatusList,
      "Order Status list fetched."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getOrderInvoiceByID = async (req, res) => {
  try {
    const orderDetails = await Order.findById(req.params.order_id).lean();

    if (!orderDetails) {
      return response.errorResponse(
        res,
        { msg: "Order not found." },
        "Order not found.",
        400
      );
    }

    const orderItems = await OrderItem.aggregate([
      {
        $match: {
          order: new mongoose.Types.ObjectId(req.params.order_id),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: {
          path: "$productInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "product_services",
          localField: "service_id",
          foreignField: "_id",
          as: "serviceInfo",
        },
      },
      {
        $unwind: {
          path: "$serviceInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          product: "$productInfo",
          service: "$serviceInfo",
          service_id: 1,
          quantity: 1,
          quality: 1,
          width: 1,
          height: 1,
          amount: 1,
          remarks: 1,
          lamination: 1,
        },
      },
    ]).collation({ locale: "en_US", strength: 1 });

    const userDetails = await User.findById(orderDetails.user).lean();
    const adminDetails = await Admin.findOne({})
      .select("-password -uuid")
      .lean();

    const invoiceData = {
      ...orderDetails,
      order_items: orderItems,
      userDetails,
      adminDetails,
    };

    console.log("invoiceData", invoiceData);

    // Generate the PDF
    const pdfBuffer = await generateInvoice(invoiceData);

    // Generate a dynamic filename
    const fileName = `invoice_${invoiceData.order_id}_${Date.now()}.pdf`;

    // Set headers for file download
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("X-Filename", fileName);

    // Send the PDF as response
    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

module.exports = {
  getOrdersList,
  createOrder,
  getOrderById,
  updateOrderById,
  updateOrderStatusById,
  getOrdersListAll,
  getOrderStatusList,
  getOrderInvoiceByID,
};
