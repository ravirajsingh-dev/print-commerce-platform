var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const ProductService = require("../../../models/ProductService");
const cloudinary = require("../../../customClasses/cloudinaryServices/cloudinaryConfig");

const getProductServicesList = async (req, res) => {
  const {
    limit = 20,
    page = 1,
    orderBy = "createdAt",
    ascending = "desc",
  } = req.query ? req.query : req.body;

  let { filters = "", query = "" } = req.query.limit ? req.query : req.body;

  // let regEx = new RegExp(query, 'i');

  var pageSize = parseInt(limit);
  var product = ascending === "desc" ? -1 : 1;
  const skip = pageSize * (page - 1);
  let filtersArgs = {};
  let filtersArgs2 = {};
  let filtersFilterArgs = {};
  let filtersSearchArgs = {};
  let orSearch = [];
  let orFilter = [];

  try {
    filters.forEach(async (item) => {
      if (typeof query === "object" && query[item]) {
        if (item === "search") {
          let productFilers = query[item];
          for (let i in productFilers) {
            const value = productFilers[i].value;

            if (i === "role") {
              orSearch.push({
                [i]: value.match(/admin/i)
                  ? 2
                  : value.match(/product/i)
                  ? 1
                  : "",
              });
            } else {
              switch (productFilers[i].type) {
                case "id":
                  orSearch.push({ [i]: mongoose.Types.ObjectId(value) });
                  break;
                case "Number":
                  orSearch.push({
                    [i]: {
                      $regex: new RegExp(parseInt(productFilers[i].value), "i"),
                    },
                  });
                  break;
                case "String":
                  orSearch.push({
                    [i]: {
                      $regex: new RegExp(
                        productFilers[i].value.toString(),
                        "i"
                      ),
                    },
                  });
                  break;
                case "Array":
                  orSearch.push({
                    [i]: {
                      $in: [productFilers[i].value.toString()],
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

  if (filters.includes("search-team")) {
    const productDetail = await ProductService.findOne({
      H2C_ID: query["search-team"].value,
    });

    filtersArgs2 = {
      "productUplines.uplines": {
        $in: [new mongoose.Types.ObjectId(productDetail?._id)],
      },
    };
  }

  try {
    let productsList = await ProductService.aggregate([
      {
        $match: filtersArgs,
      },
      {
        $project: {
          title: 1,
          product_sku: 1,
          description: 1,
          stock: 1,
          status: 1,
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
                [orderBy]: product,
              },
            },
            { $skip: skip },
            { $limit: pageSize },
          ],
        },
      },
    ]).collation({ locale: "en_US", strength: 1 });

    if (productsList[0].metadata.length > 0) {
      return response.successResponse(
        res,
        productsList,
        "ProductServices  List."
      );
    } else {
      productsList = [
        {
          metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
          data: [],
        },
      ];
      return response.successResponse(res, productsList, "No ProductServices.");
    }
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const createProductService = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }
  const {
    product,
    title,
    production_time,
    price,
    price_per_square,
    stock,
    description,
    fields,
    isCatExist,
    quality,
  } = req.body;

  let image_url = "";

  if (req.file) {
    const folderName = "product_services";

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
    });

    // Get the public URL
    image_url = result.secure_url;

    console.log("Image uploaded successfully:", image_url);

    if (fs.existsSync(req.file.path)) {
      // remove temp file after download
      fs.unlinkSync(req.file.path);
    }
  }

  try {
    let productSerivce = new ProductService({
      title,
      product,
      production_time,
      price,
      price_per_square,
      stock,
      description,
      fields,
      image: image_url,
      lastEditedBy: req.user.id,
      isCatExist,
      quality,
    });

    const product_doc = await productSerivce.save();

    if (!product_doc) {
      return response.errorResponse(
        res,
        "Oops, something went wrong. Unable to add product.",
        500
      );
    }

    return response.successResponse(
      res,
      { _id: product_doc._id },
      "Product Service created."
    );
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getProductServiceById = async (req, res) => {
  try {
    const product = await ProductService.findById({
      _id: req.params.product_service_id,
    }).lean();
    if (!product) {
      return response.errorResponse(
        res,
        { msg: "Product Service not found." },
        "Product Service not found.",
        400
      );
    }

    return response.successResponse(res, product, "ProductService data.");
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return response.errorResponse(
        res,
        { msg: "ProductService not found." },
        "ProductService not found.",
        400
      );
    }
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const updateProductServiceById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const {
    product,
    title,
    production_time,
    price,
    price_per_square,
    stock,
    description,
    fields,
    isCatExist,
    quality,
  } = req.body;

  const productFields = {
    product,
    title,
    production_time,
    price,
    price_per_square,
    stock,
    description,
    fields,
    isCatExist,
    quality,
  };

  try {
    const product = await ProductService.findByIdAndUpdate(
      { _id: req.params.product_service_id },
      { $set: productFields },
      { new: true }
    ).lean();

    if (!product) {
      return response.errorResponse(
        res,
        { msg: "Product Service not found." },
        "Product Service not found.",
        400
      );
    }

    return response.successResponse(res, product, "Product Service Updated.");
  } catch (err) {
    // console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const deleteProductServiceById = async (req, res) => {
  try {
    const product = await ProductService.findByIdAndDelete({
      _id: req.params.product_service_id,
    }).select("_id");

    return response.successResponse(res, product, "Product Service deleted.");
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const updateProductServiceStatusById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { status } = req.body;

  try {
    const product = await ProductService.findByIdAndUpdate(
      req.params.product_service_id,
      {
        $set: { status, lastEditedBy: req.user.id },
      },
      {
        new: true,
      }
    );

    if (!product) {
      return response.errorResponse(res, {}, "ProductService not found.", 400);
    }

    return response.successResponse(
      res,
      product,
      "ProductService status updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const changeProductServicePasswordByID = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return await response.errorResponse(res, errors.array());
  }

  const { password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    var new_password = await bcrypt.hash(password, salt);

    const updatedDoc = await ProductService.findByIdAndUpdate(
      req.params.product_service_id,
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
      "ProductService password updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getProductServicesByID = async (req, res) => {
  try {
    const product_id = req.params.product_id;

    const list = await ProductService.find({
      product: new mongoose.Types.ObjectId(product_id),
    });

    return response.successResponse(res, list, "Product services By ID.");
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getProductServicesListAll = async (req, res) => {
  try {
    const productsList = await ProductService.find({});

    return response.successResponse(
      res,
      productsList,
      "Products Services List All."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

module.exports = {
  getProductServicesList,
  createProductService,
  getProductServiceById,
  updateProductServiceById,
  deleteProductServiceById,
  updateProductServiceStatusById,
  changeProductServicePasswordByID,
  getProductServicesByID,
  getProductServicesListAll,
};
