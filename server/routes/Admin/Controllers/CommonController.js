var response = require("../../../config/response");
const User = require("../../../models/User");
const Service = require("../../../models/Service");
const Product = require("../../../models/Product");
const ProductService = require("../../../models/ProductService");
const ServiceCategory = require("../../../models/ServiceCategory");
const Admin = require("../../../models/Admin");
const Banner = require("../../../models/Banner");
const Credential = require("../../../models/Credential");
const Wallet = require("../../../models/Wallet");
const DeductMoney = require("../../../models/DeductMoney");

const { generateQRCodeWithAmount } = require("../../../utils/QRCodeHelper");
const mongoose = require("mongoose");

const getUsersList = async (req, res) => {
  try {
    const usersList = await User.find({});

    return response.successResponse(res, usersList, "Users List.");
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getServicesList = async (req, res) => {
  try {
    const servicesList = await Service.find({}).lean();

    return response.successResponse(res, servicesList, "Services List.");
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getProductsList = async (req, res) => {
  try {
    const productList = await Product.find({}).lean();

    return response.successResponse(res, productList, "Products List.");
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getProductServicesListByID = async (req, res) => {
  try {
    const productID = req.params.product_id;

    const productServicesList = await ProductService.find({
      product: productID,
    }).lean();

    return response.successResponse(
      res,
      productServicesList,
      "Product Services List."
    );
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getProductServiceCategoriesListByID = async (req, res) => {
  try {
    const productServiceID = req.params.product_service_id;

    const servicesCategoriesList = await ServiceCategory.find({
      product_service: productServiceID,
    }).lean();

    return response.successResponse(
      res,
      servicesCategoriesList,
      "Services Categories List."
    );
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const generateQRCode = async (req, res) => {
  try {
    const { upi_id, amount } = req.params;

    const upiCredential = await Credential.findById({ _id: upi_id }).lean();

    console.log("upiCredential", upiCredential);

    const { qrCodeData } = await generateQRCodeWithAmount(
      upiCredential.upi,
      upiCredential.name,
      amount
    );

    return response.successResponse(
      res,
      qrCodeData,
      "Payment link QR code generated."
    );
  } catch (err) {
    console.error("Error fetching payment link status:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getAdminPrimeCredentials = async (req, res) => {
  try {
    const [primeBankDetails, primeUPIDetails] = await Promise.all([
      Credential.find({ type: "bank", primary: true }).lean(),
      Credential.find({ type: "upi", primary: true }).lean(),
    ]);

    return response.successResponse(
      res,
      [...primeBankDetails, ...primeUPIDetails],
      "Primary Credentials List."
    );
  } catch (err) {
    console.error("Error fetching primary credentials:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};
const getAdminDetails = async (req, res) => {
  try {
    const adminDetails = await Admin.findOne({})
      .select("-password -uuid")
      .lean();

    return response.successResponse(res, adminDetails, "Admin Details.");
  } catch (err) {
    console.error("Error fetching primary credentials:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getProductServicesListByID2 = async (req, res) => {
  try {
    const productID = req.params.product_id;

    const productServicesList = await ProductService.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productID),
        },
      },
      {
        $unwind: {
          path: "$quality",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return response.successResponse(
      res,
      productServicesList,
      "Product Services List."
    );
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const getBannersList = async (req, res) => {
  try {
    const bannersList = await Banner.find({}).lean();

    return response.successResponse(res, bannersList, "Banners List.");
  } catch (err) {
    console.log(err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

const deductMoneyFromWallet = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { amount } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return response.errorResponse(
        res,
        { msg: "User not found." },
        "User not found.",
        400
      );
    }

    const userWallet = Wallet.findOne({ user: userId });

    if (!userWallet) {
      return response.errorResponse(
        res,
        { msg: "User wallet not found." },
        "User wallet not found.",
        400
      );
    }
    if (userWallet.balance < amount) {
      return response.errorResponse(
        res,
        { msg: "Insufficient user wallet balance." },
        "Insufficient  userwallet balance.",
        400
      );
    }

    console.log("Deducting amount from wallet:", amount);

    const updatedWallet = await Wallet.findOneAndUpdate(
      { user: userId },
      { $inc: { currentBalance: -amount } },
      { new: true }
    );

    await updatedWallet.addTransaction(
      "debit",
      amount,
      `Deducted from wallet for by Shree Advertising`
    );

    let deducted = new DeductMoney({
      user: userId,
      amount: amount,
      updatedBy: req.user.id,
    });

    await deducted.save();

    return response.successResponse(
      res,
      updatedWallet,
      "Money deducted from wallet successfully."
    );
  } catch (err) {
    console.error("Error deducting money from wallet:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

module.exports = {
  getUsersList,
  getServicesList,
  getProductsList,
  getProductServicesListByID,
  getProductServiceCategoriesListByID,
  generateQRCode,
  getAdminPrimeCredentials,
  getProductServicesListByID2,
  getAdminDetails,
  getBannersList,
  deductMoneyFromWallet,
};
