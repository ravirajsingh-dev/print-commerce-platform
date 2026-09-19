const express = require("express");
const router = express.Router();
const { UserAuth } = require("../../middleware/auth");
const {
  getUserDownlineTree,
  getUserDirectDownline,
  getUserRightDownline,
  getUserLeftDownline,
} = require("./Controllers/DownlineController");

// @route GET api/users/downline/:user_id/tree
// @desc Get the entire downline tree of a user
// @access Private
router.get("/:user_id/tree", UserAuth, getUserDownlineTree);

// @route GET api/users/downline/:user_id/direct
// @desc Get the direct downline (immediate children) of a user
// @access Private
router.get("/:user_id/direct", UserAuth, getUserDirectDownline);

// @route GET api/users/downline/:user_id/left-downline
// @desc Get the left downline of a user
// @access Private
router.get("/:user_id/left-downline", UserAuth, getUserLeftDownline);

// @route GET api/users/downline/:user_id/right-downline
// @desc Get the right downline of a user
// @access Private
router.get("/:user_id/right-downline", UserAuth, getUserRightDownline);

module.exports = router;
