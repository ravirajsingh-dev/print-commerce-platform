const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const OrderModel = require("../models/Order"); // Adjust to your model path

const emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

module.exports.isEmailValid = (email) => {
  if (!email) return false;

  if (email.length > 254) return false;

  var valid = emailRegex.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  var parts = email.split("@");
  if (parts[0].length > 64) return false;

  var domainParts = parts[1].split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};

module.exports.isSelfSponsorIDValid = (code) => {
  const selfSponsorIDRegex = /^MX\d{7}$/;
  return selfSponsorIDRegex.test(code);
};

module.exports.isPhoneNumberValid = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

module.exports.removeArrayDuplicates = (arr) => {
  return [...new Set(arr)];
};

module.exports.randomString = (length = 5) => {
  return Math.round(
    Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)
  )
    .toString(36)
    .slice(1);
};

module.exports.generateRandomString = (length = 6) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  return Array.from(crypto.randomBytes(length))
    .map((byte) => characters[byte % charactersLength])
    .join("");
};

module.exports.generateUniqueSAID = () => {
  const prefix = "SA";
  const uniqueString = uuidv4().replace(/-/g, "");

  const hash = crypto.createHash("sha1");
  hash.update(uniqueString);
  const hashedString = hash.digest("hex");

  const numericCharacters = hashedString.replace(/\D/g, "");

  const uniqueCode = prefix + numericCharacters;

  const trimmedUniqueCode = uniqueCode.substring(0, 8);

  return trimmedUniqueCode;
};

module.exports.uniqueNumericCode = () => {
  const uniqueString = uuidv4().replace(/-/g, "");

  const hash = crypto.createHash("sha1");
  hash.update(uniqueString);
  const hashedString = hash.digest("hex");

  const numericCharacters = hashedString.replace(/\D/g, "");

  const uniqueCode = numericCharacters;

  const trimmedUniqueCode = uniqueCode.substring(0, 10);

  return trimmedUniqueCode;
};

module.exports.comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    const validPassword = await bcrypt.compare(plainPassword, hashedPassword);
    return validPassword;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

module.exports.parseTokenExpiryTime = (tokenExpiryTime) => {
  const unit = tokenExpiryTime.slice(-1);
  const value = parseInt(tokenExpiryTime.slice(0, -1));

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "m":
      return value * 60 * 1000;
    case "s":
      return value * 1000;
    default:
      throw new Error("Invalid token expiry time unit");
  }
};

module.exports.formatMobileNumber = (mobile) => {
  if (!mobile) return "";
  let formatted = mobile.replace(/\D/g, "");

  if (!formatted.startsWith("91")) {
    formatted = "91" + formatted;
  }

  return formatted;
};

module.exports.generateOtp = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.maskEmail = (email) => {
  if (!email) return "xxx-xxx-xxx";
  const [localPart, domain] = email.split("@");
  const maskedLocal =
    localPart.length > 2
      ? `${localPart[0]}${"*".repeat(localPart.length - 2)}${localPart.slice(
          -1
        )}`
      : `${localPart[0]}*`;
  return `${maskedLocal}@${domain}`;
};

module.exports.parseExtension = (filename) => {
  const extensionsList = filename.split(".");
  const extLen = extensionsList.length;
  return extensionsList[extLen - 1];
};

// generateUniqueNumericCode = (prefix = "PROD") => {
//   const uniqueString = uuidv4().replace(/-/g, "");

//   const hash = crypto.createHash("sha1");
//   hash.update(uniqueString);
//   const hashedString = hash.digest("hex");

//   const numericCharacters = hashedString.replace(/\D/g, "");

//   const uniqueCode = prefix + numericCharacters;

//   const trimmedUniqueCode = uniqueCode.substring(0, 9);

//   return trimmedUniqueCode;
// };

module.exports.generateUniqueNumericCode = async (
  prefix = "ORD",
  numberLength = 5
) => {
  const startFrom = 1565;

  // 1. Find the latest order number matching the pattern
  const lastOrder = await OrderModel.findOne({
    order_id: { $regex: `^${prefix}\\d{${numberLength}}$` },
  })
    .sort({ order_id: -1 })
    .lean();

  let lastNumber = startFrom - 1;

  if (lastOrder?.order_id) {
    const match = lastOrder.order_id.match(/\d+$/);
    if (match) {
      lastNumber = parseInt(match[0], 10);
    }
  }

  let nextNumber = lastNumber + 1;

  // 2. Keep checking until a unique order number is found
  while (true) {
    const newOrderNumber =
      prefix + nextNumber.toString().padStart(numberLength, "0");

    const exists = await OrderModel.exists({ order_id: newOrderNumber });

    if (!exists) {
      return newOrderNumber;
    }

    nextNumber++;
  }
};
