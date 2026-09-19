var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

// const welcomeEmail = require("../../../Notifications/Emails/welcomeEmail");

const Order = require("../../../models/Order");
const OrderItem = require("../../../models/OrderItem");
const ProductService = require("../../../models/ProductService");
const OrderStatus = require("../../../models/OrderStatus");

const { generateUniqueNumericCode } = require("../../../utils/helper");
const Wallet = require("../../../models/Wallet");

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

  console.log("filters", filters);

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

  filtersArgs = Object.assign({}, filtersFilterArgs, filtersSearchArgs);

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

  const { name, amount, full_amount, user, order_items } = req.body;

  try {
    const order_id = await generateUniqueNumericCode("ORD");

    let order = new Order({
      user,
      name,
      amount,
      full_amount,
      order_id,
    });

    const order_doc = await order.save();

    const orderStatus = new OrderStatus({
      order: order_doc._id,
    });

    await orderStatus.save();

    if (!order_doc) {
      return response.errorResponse(
        res,
        "Oops, something went wrong. Unable to add order.",
        500
      );
    }

    // ❗ DO NOT USE forEach WITH async
    for (const eachItem of order_items) {
      let item = new OrderItem({
        order: order_doc._id,
        product: eachItem.product,
        service_id: eachItem.service_id,
        category_id: eachItem.category_id,
        quantity: eachItem.quantity,
        quality: eachItem.quality,
        width: eachItem.width,
        height: eachItem.height,
        width_feet: eachItem.width_feet,
        height_feet: eachItem.height_feet,
        total_square_fit: eachItem?.total_square_fit,
        amount: eachItem.amount,
        remarks: eachItem.remarks,
        lamination: eachItem.lamination,
        role_used: eachItem.role_used,
      });

      await item.save();
    }

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
    const order = await Order.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.order_id),
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
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "orderItems.product",
        },
      },
      {
        $unwind: {
          path: "$orderItems.product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "product_services",
          localField: "orderItems.service_id",
          foreignField: "_id",
          as: "orderItems.service",
        },
      },
      {
        $unwind: {
          path: "$orderItems.service",
          preserveNullAndEmptyArrays: true,
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
        $project: {
          name: 1,
          amount: 1,
          full_amount: 1,
          user: 1,
          order_items: "$orderItems",
        },
      },
    ]).collation({ locale: "en_US", strength: 1 });

    if (!order?.length) {
      return response.errorResponse(
        res,
        { msg: "Order not found." },
        "Order not found.",
        400
      );
    }

    return response.successResponse(res, order[0], "Order data.");
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

  const { name, amount, full_amount, order_items = [] } = req.body;

  const orderFields = {
    name,
    amount,
    full_amount,
    lastEditedBy: req.user.id,
  };

  try {
    // -------- Update Main Order --------
    const order = await Order.findByIdAndUpdate(
      req.params.order_id,
      { $set: orderFields },
      { new: true }
    ).lean();

    if (!order) {
      return response.errorResponse(
        res,
        { msg: "Order not found." },
        "Order not found.",
        400
      );
    }

    // -------- Update or Create Order Items --------
    await Promise.all(
      order_items.map(async (item) => {
        // 🔹 UPDATE EXISTING ITEM
        if (item._id) {
          return OrderItem.findByIdAndUpdate(
            item._id,
            { $set: item },
            { new: true }
          );
        }

        // 🔹 CREATE NEW ITEM (No _id found)
        const newItem = new OrderItem({
          ...item,
          order: req.params.order_id,
        });

        return await newItem.save();
      })
    );

    return response.successResponse(res, order, "Order Updated.");
  } catch (err) {
    console.error("Update Error:", err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete({
      _id: req.params.order_id,
    }).select("_id");

    return response.successResponse(res, order, "Order deleted.");
  } catch (err) {
    console.error(err.message);
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
      return response.errorResponse(res, {}, "Order not found.", 400);
    }

    if (status === "confirmed") {
      // Set order confirmed if wallet has amount
      const wallet = await Wallet.findOne({
        user: new mongoose.Types.ObjectId(orderDetails.user),
      });

      if (wallet?.currentBalance > orderDetails?.full_amount) {
        // const orderItems = await OrderItem.find({
        //   order: orderDetails._id,
        // });

        // console.log("orderItems", orderItems);

        // orderItems.forEach(async (eachItem) => {
        //   const productServiceInfo = await ProductService.findById(
        //     eachItem.service_id
        //   );

        //   let pPrice = 1;

        //   if (productServiceInfo?.price) {
        //     pPrice = productServiceInfo?.price || 1;
        //   } else {
        //     selectedQuality = productServiceInfo.quality?.find(
        //       (each) => each.title === eachItem.quality
        //     );

        //     pPrice = selectedQuality?.price || 1;
        //   }

        //   const itemSize = eachItem.amount / pPrice;

        //   let remainingStock = productServiceInfo.stock - itemSize;
        //   productServiceInfo.stock = remainingStock;

        //   console.log("remainingStock", remainingStock);

        //   if (remainingStock > 0) {
        //     console.log("remainingStock", remainingStock);
        //     return response.errorResponse(
        //       res,
        //       {},
        //       "Insuficient Stock, Please add stock and try again.",
        //       400
        //     );
        //   } else {
        //     console.log("remainingStock", remainingStock);
        //     return response.errorResponse(
        //       res,
        //       {},
        //       "Insuficient Stock, Please add stock and try again.",
        //       400
        //     );
        //   }
        // });

        await Order.findByIdAndUpdate(req.params.order_id, {
          $set: {
            status: "confirmed",
          },
        });

        // Add transaction and update wallet balance
        await wallet.addTransaction(
          "debit",
          orderDetails?.full_amount,
          `Wallet debited with ₹${orderDetails?.full_amount} for Order : ${orderDetails.order_id}`
        );
      } else {
        if (!orderDetails?.full_amount) {
          return response.errorResponse(
            res,
            {
              msg: "Order has no amount, Please add Order Amount",
            },
            "Order has no amount, Please add Order Amount",
            400
          );
        }

        return response.errorResponse(
          res,
          {
            msg: "Insuffcient User Wallet Amount, Please try after adding balance",
          },
          "Insuffcient User Wallet Amount, Please try after adding balance",
          400
        );
      }
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

const changeOrderPasswordByID = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return await response.errorResponse(res, errors.array());
  }

  const { password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    var new_password = await bcrypt.hash(password, salt);

    const updatedDoc = await Order.findByIdAndUpdate(
      req.params.order_id,
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
      "Order password updated successfully."
    );
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
  deleteOrderById,
  updateOrderStatusById,
  changeOrderPasswordByID,
};
