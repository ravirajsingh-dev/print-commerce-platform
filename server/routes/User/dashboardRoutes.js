const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { getDashboardDetails } = require("./Controllers/DashboardController");

// @route GET api/user/dashboard
// @desc Get Dashboard list
// @access Private
router.get("/", [auth.User], getDashboardDetails);

module.exports = router;
