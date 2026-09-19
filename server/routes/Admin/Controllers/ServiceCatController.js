var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

// const welcomeEmail = require("../../../Notifications/Emails/welcomeEmail");

const ServiceCategory = require("../../../models/ServiceCategory");
const { generateUniqueNumericCode } = require("../../../utils/helper");
// const { generateUniqueNumericCode } = require("../../../utils/nodeHelper");
const cloudinary = require("../../../customClasses/cloudinaryServices/cloudinaryConfig");

const getServiceCatsList = async (req, res) => {
  const {
    limit = 20,
    page = 1,
    orderBy = "createdAt",
    ascending = "desc",
  } = req.query ? req.query : req.body;

  let { filters = "", query = "" } = req.query.limit ? req.query : req.body;

  // let regEx = new RegExp(query, 'i');

  var pageSize = parseInt(limit);
  var serviceCat = ascending === "desc" ? -1 : 1;
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
          let serviceCatFilers = query[item];
          for (let i in serviceCatFilers) {
            const value = serviceCatFilers[i].value;

            if (i === "role") {
              orSearch.push({
                [i]: value.match(/admin/i)
                  ? 2
                  : value.match(/serviceCat/i)
                  ? 1
                  : "",
              });
            } else {
              switch (serviceCatFilers[i].type) {
                case "id":
                  orSearch.push({ [i]: mongoose.Types.ObjectId(value) });
                  break;
                case "Number":
                  orSearch.push({
                    [i]: {
                      $regex: new RegExp(
                        parseInt(serviceCatFilers[i].value),
                        "i"
                      ),
                    },
                  });
                  break;
                case "String":
                  orSearch.push({
                    [i]: {
                      $regex: new RegExp(
                        serviceCatFilers[i].value.toString(),
                        "i"
                      ),
                    },
                  });
                  break;
                case "Array":
                  orSearch.push({
                    [i]: {
                      $in: [serviceCatFilers[i].value.toString()],
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
    const serviceCatDetail = await ServiceCategory.findOne({
      H2C_ID: query["search-team"].value,
    });

    filtersArgs2 = {
      "serviceCatUplines.uplines": {
        $in: [new mongoose.Types.ObjectId(serviceCatDetail?._id)],
      },
    };
  }

  try {
    let serviceCatsList = await ServiceCategory.aggregate([
      {
        $match: filtersArgs,
      },
      {
        $project: {
          title: 1,
          description: 1,
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
                [orderBy]: serviceCat,
              },
            },
            { $skip: skip },
            { $limit: pageSize },
          ],
        },
      },
    ]).collation({ locale: "en_US", strength: 1 });

    if (serviceCatsList[0].metadata.length > 0) {
      return response.successResponse(
        res,
        serviceCatsList,
        "ServiceCats  List."
      );
    } else {
      serviceCatsList = [
        {
          metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
          data: [],
        },
      ];
      return response.successResponse(res, serviceCatsList, "No ServiceCats.");
    }
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const createServiceCat = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }
  const {
    product,
    product_service,
    title,
    image,
    production_time,
    price,
    price_per_square,
    stock,
    description,
    fields,
    quality,
  } = req.body;

  let image_url = "";

  if (req.file) {
    const folderName = "service_categories";

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
    let serviceCat = new ServiceCategory({
      product,
      product_service,
      title,
      image,
      production_time,
      price,
      price_per_square,
      stock,
      description,
      image: image_url,
      fields,
      quality,
      lastEditedBy: req.user.id,
    });

    const serviceCat_doc = await serviceCat.save();

    if (!serviceCat_doc) {
      return response.errorResponse(
        res,
        "Oops, something went wrong. Unable to add serviceCat.",
        500
      );
    }

    return response.successResponse(
      res,
      { _id: serviceCat_doc._id },
      "ServiceCat created."
    );
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getServiceCatById = async (req, res) => {
  try {
    const serviceCat = await ServiceCategory.findById({
      _id: req.params.service_cat_id,
    }).lean();
    if (!serviceCat) {
      return response.errorResponse(
        res,
        { msg: "ServiceCat not found." },
        "ServiceCat not found.",
        400
      );
    }

    return response.successResponse(res, serviceCat, "ServiceCat data.");
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return response.errorResponse(
        res,
        { msg: "ServiceCat not found." },
        "ServiceCat not found.",
        400
      );
    }
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const updateServiceCatById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const {
    product,
    product_service,
    title,
    image,
    production_time,
    price,
    price_per_square,
    stock,
    description,
    fields,
    quality,
  } = req.body;

  const serviceCatFields = {
    product,
    product_service,
    title,
    image,
    production_time,
    price,
    price_per_square,
    stock,
    description,
    fields,
    quality,
  };

  try {
    const serviceCat = await ServiceCategory.findByIdAndUpdate(
      { _id: req.params.service_cat_id },
      { $set: serviceCatFields },
      { new: true }
    ).lean();

    if (!serviceCat) {
      return response.errorResponse(
        res,
        { msg: "ServiceCat not found." },
        "ServiceCat not found.",
        400
      );
    }

    return response.successResponse(res, serviceCat, "ServiceCat Updated.");
  } catch (err) {
    // console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const deleteServiceCatById = async (req, res) => {
  try {
    const serviceCat = await ServiceCategory.findByIdAndDelete({
      _id: req.params.service_cat_id,
    }).select("_id");

    return response.successResponse(res, serviceCat, "ServiceCat deleted.");
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const updateServiceCatStatusById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { status } = req.body;

  try {
    const serviceCat = await ServiceCategory.findByIdAndUpdate(
      req.params.service_cat_id,
      {
        $set: { status, lastEditedBy: req.user.id },
      },
      {
        new: true,
      }
    );

    if (!serviceCat) {
      return response.errorResponse(res, {}, "ServiceCat not found.", 400);
    }

    return response.successResponse(
      res,
      serviceCat,
      "ServiceCat status updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const changeServiceCatPasswordByID = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return await response.errorResponse(res, errors.array());
  }

  const { password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    var new_password = await bcrypt.hash(password, salt);

    const updatedDoc = await ServiceCategory.findByIdAndUpdate(
      req.params.service_cat_id,
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
      "ServiceCat password updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getServiceCatsListAll = async (req, res) => {
  try {
    const serviceCatsList = await ServiceCategory.find({});

    return response.successResponse(
      res,
      serviceCatsList,
      "ServiceCats List fetched."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

module.exports = {
  getServiceCatsList,
  createServiceCat,
  getServiceCatById,
  updateServiceCatById,
  deleteServiceCatById,
  updateServiceCatStatusById,
  changeServiceCatPasswordByID,
  getServiceCatsListAll,
};
