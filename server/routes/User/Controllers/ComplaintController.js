var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");
const cloudinary = require("../../../customClasses/cloudinaryServices/cloudinaryConfig");

const Complaint = require("../../../models/Complaint");

const getComplaintsList = async (req, res) => {
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

  try {
    let complaintsList = await Complaint.aggregate([
      {
        $match: filtersArgs,
      },
      {
        $project: {
          orderNumber: 1,
          language: 1,
          complaintType: 1,
          complaintDescription: 1,
          file: 1,
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

    if (complaintsList[0].metadata.length > 0) {
      return response.successResponse(res, complaintsList, "Complaints  List.");
    } else {
      complaintsList = [
        {
          metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
          data: [],
        },
      ];
      return response.successResponse(res, complaintsList, "No Complaints.");
    }
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const createComplaint = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    const {
      orderNumber,
      language,
      complaintType,
      complaintDescription,
      file,
      status,
    } = req.body;

    let image_url = "";

    if (req.file) {
      const folderName = "complaints";

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

    let complaint = new Complaint({
      user: req.user.id,
      orderNumber,
      language,
      complaintType,
      complaintDescription,
      file: image_url,
      status,
    });

    const comp_doc = await complaint.save();

    if (!comp_doc) {
      return response.errorResponse(
        res,
        "Oops, something went wrong. Unable to add complaint.",
        500
      );
    }

    return response.successResponse(
      res,
      { _id: comp_doc._id },
      "Complaint created."
    );
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

module.exports = {
  getComplaintsList,
  createComplaint,
};
