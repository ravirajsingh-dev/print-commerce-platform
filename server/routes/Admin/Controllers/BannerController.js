var response = require("../../../config/response");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const Banner = require("../../../models/Banner");
const { processSearchFilters } = require("../../../utils/searchHelper");
const cloudinary = require("../../../customClasses/cloudinaryServices/cloudinaryConfig");

const getBannersList = async (req, res) => {
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

    const bannersList = await Banner.aggregate([
      { $match: filtersArgs },
      {
        $project: {
          title: 1,
          image: 1,
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

    if (bannersList[0].metadata.length > 0) {
      return response.successResponse(res, bannersList, "Banners List.");
    } else {
      return response.successResponse(
        res,
        [
          {
            metadata: [{ totalRecord: 0, current_page: 1, per_page: pageSize }],
            data: [],
          },
        ],
        "No Banners."
      );
    }
  } catch (err) {
    console.error("Error fetching banners list:", err.message);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const createBanner = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    const { title } = req.body;

    let image_url = "";

    if (req.file) {
      console.log("File found:", req.file);
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Get the public URL
      image_url = result.secure_url;

      console.log("Image uploaded successfully:", image_url);

      if (fs.existsSync(req.file.path)) {
        // remove temp file after download
        fs.unlinkSync(req.file.path);
      }
    }
    console.log("Image URL:", image_url);

    let banner = new Banner({
      title,
      image: image_url,
    });

    const banner_doc = await banner.save();
    if (!banner_doc) {
      return response.errorResponse(
        res,
        "Oops, something went wrong. Unable to add banner.",
        500
      );
    }

    return response.successResponse(
      res,
      { _id: banner_doc._id },
      "Banner added."
    );
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById({ _id: req.params.banner_id })
      .select("-password -setPassword")
      .lean();
    if (!banner) {
      return response.errorResponse(
        res,
        { msg: "Banner not found." },
        "Banner not found.",
        400
      );
    }

    return response.successResponse(res, banner, "Banner data.");
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return response.errorResponse(
        res,
        { msg: "Banner not found." },
        "Banner not found.",
        400
      );
    }
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const updateBannerById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  try {
    const {
      business_name,
      name,
      email,
      ccode,
      phone,
      address,
      city,
      state,
      country,
      pin_code,
      gst_number,
      reference_by,
    } = req.body;

    const ccode_phone = ccode + phone;

    const bannerFields = {
      business_name,
      name,
      email,
      ccode,
      phone,
      ccode_phone,
      address,
      city,
      state,
      country,
      pin_code,
      gst_number,
      reference_by,
    };

    const banner = await Banner.findByIdAndUpdate(
      { _id: req.params.banner_id },
      { $set: bannerFields },
      { new: true }
    )
      .select("-password -setPassword")
      .lean();

    if (!banner) {
      return response.errorResponse(
        res,
        { msg: "Banner not found." },
        "Banner not found.",
        400
      );
    }

    return response.successResponse(res, banner, "Banner Updated.");
  } catch (err) {
    // console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const deleteBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete({
      _id: req.params.banner_id,
    }).select("_id");

    return response.successResponse(res, banner, "Banner deleted.");
  } catch (err) {
    console.error(err.message);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const updateBannerStatusById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { status } = req.body;

  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.banner_id,
      {
        $set: { status, lastEditedBy: req.banner.id },
      },
      {
        new: true,
      }
    );

    if (!banner) {
      return response.errorResponse(res, {}, "Banner not found.", 400);
    }

    return response.successResponse(
      res,
      banner,
      "Banner status updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

const changeBannerPasswordByID = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return response.errorResponse(res, errors.array());
  }

  const { password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    var new_password = await bcrypt.hash(password, salt);

    const updatedDoc = await Banner.findByIdAndUpdate(
      req.params.banner_id,
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
      "Banner password updated successfully."
    );
  } catch (err) {
    console.error(err);
    return response.errorResponse(res, {}, "Server Error.", 500);
  }
};

module.exports = {
  getBannersList,
  createBanner,
  getBannerById,
  updateBannerById,
  deleteBannerById,
  updateBannerStatusById,
  changeBannerPasswordByID,
};
