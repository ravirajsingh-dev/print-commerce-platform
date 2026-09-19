const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const standard_password = require("../../utils/constants");

const {
  getCredentialsList,
  getCredentialsById,
  createCredential,
  updateCredentialById,
  deleteUserCredentialById,
} = require("./Controllers/CredentialController");

// @route GET api/user/upis/:user_id/list
// @desc Get users upis list
// @access Private
router.get("/", [auth.User], getCredentialsList);

// @route GET api/user/upis/:credential_id
// @desc Get users upi by credential_id
// @access Private
router.get("/:credential_id", [auth.User], getCredentialsById);

// @route POST api/user/upis/create
// @desc Create new upi
// @access Private
router.post(
  "/",
  [
    auth.User,
    check("type", "Type is required").isString(),
    check("txn_password", standard_password.validation_msg).matches(
      standard_password.validation_pattern
    ),
  ],
  createCredential
);

// @route PUT api/user/upis/:credential_id
// @desc Update upi by credential_id
// @access Private
router.put(
  "/:credential_id",
  [
    auth.User,
    check("txn_password", standard_password.validation_msg).matches(
      standard_password.validation_pattern
    ),
  ],
  updateCredentialById
);

// @route DELETE api/user/upis/:credential_id
// @desc Delete user upi by credential_id
// @access Private
router.delete("/:credential_id", auth.User, deleteUserCredentialById);

module.exports = router;
