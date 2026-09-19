const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const standard_password = require("../../utils/constants");

const {
  getComplaintsList,
  getComplaintsById,
  createComplaint,
  updateComplaintById,
  deleteUserComplaintById,
  updateComplaintStatusById,
} = require("./Controllers/ComplaintController");

// @route GET api/user/upis/:user_id/list
// @desc Get users upis list
// @access Private
router.get("/", [auth.Admin], getComplaintsList);

// @route GET api/user/upis/:complaint_id
// @desc Get users upi by complaint_id
// @access Private
router.get("/:complaint_id", [auth.Admin], getComplaintsById);

// @route POST api/user/upis/create
// @desc Create new upi
// @access Private
router.post(
  "/",
  [
    auth.Admin,
    check("type", "Type is required").isString(),
    // check("txn_password", standard_password.validation_msg).matches(
    //   standard_password.validation_pattern
    // ),
  ],
  createComplaint
);

// @route PUT api/user/upis/:complaint_id
// @desc Update upi by complaint_id
// @access Private
router.put(
  "/:complaint_id",
  [
    auth.Admin,
    // check("txn_password", standard_password.validation_msg).matches(
    //   standard_password.validation_pattern
    // ),
  ],
  updateComplaintById
);

// @route PUT api/user/upis/:complaint_id/update-status
// @desc Update Status of complaint by ID
// @access Private
router.put(
  "/:complaint_id/update-status",
  [
    auth.Admin,
    // check("txn_password", standard_password.validation_msg).matches(
    //   standard_password.validation_pattern
    // ),
  ],
  updateComplaintStatusById
);

// @route DELETE api/user/upis/:complaint_id
// @desc Delete user upi by complaint_id
// @access Private
router.delete("/:complaint_id", auth.Admin, deleteUserComplaintById);

module.exports = router;
