const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const _ = require("lodash");
const multer = require("multer");
const complaint_dir = "./public/uploads/complaint";
const response = require("../../config/response");

const {
  getComplaintsList,
  createComplaint,
} = require("./Controllers/ComplaintController");

const storeComplaintImage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.exists(complaint_dir, function (exists) {
      if (!exists) {
        fs.mkdirSync(complaint_dir, { recursive: true });
      }
      cb(null, complaint_dir);
    });
  },
  filename: function (req, file, cb) {
    req.body = JSON.parse(JSON.stringify(req.body));
    const filename = file.originalname;
    cb(null, "complaint-image-" + Date.now() + "-" + filename);
  },
});

const uploadImage = multer({
  storage: storeComplaintImage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    const match = ["image/jpeg", "image/png"];
    if (match.indexOf(file.mimetype) === -1) {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: { fileSize: 5000000 },
});

// @route GET api/admin/orders/list
// @desc Get orders list
// @access Private
router.get("/list", [auth.User], getComplaintsList);

// @route POST api/admin/order
// @desc Create Order
// @access Private
router.post(
  "/",
  function (req, res, next) {
    let onlyOnce = true;
    uploadImage.single("file")(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return response.errorResponse(
            res,
            {
              msg: "Attached file is too large. Exceed allowed file limit: 5MB",
            },
            "Attached file is too large. Exceed allowed file limit: 5MB",
            400
          );
        }
        return response.errorResponse(
          res,
          { msg: err.message },
          err.message,
          400
        );
      }
      if (onlyOnce) {
        onlyOnce = false;
        next();
      }
    });
    req.body = JSON.parse(JSON.stringify(req.body));
  },
  [
    auth.User,
    [
      check("orderNumber", "Please provide the Order Number")
        .not()
        .trim()
        .isEmpty(),
    ],
  ],
  createComplaint
);

module.exports = router;
