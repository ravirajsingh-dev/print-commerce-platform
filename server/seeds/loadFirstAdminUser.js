const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const User = require("../models/User");
const Wallet = require("../models/Wallet");

const { MONGO_URI } = require("../config/config");

const loadFirstAdminUser = () => {
  return new Promise(async () => {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGO_URI);

    console.log("DB connected!");

    const userData = {
      name: "Print Commerce",
      email: "admin@example.com",
      ccode: "91",
      phone: "1234567890",
      ccode_phone: "911234567890",
      H2C_ID: "H2C000001",
      sponsorH2C: "HCC000001",
      uplineH2C: "HCC000001",
      position: "left",
      city: "Jaipur",
      state: "Rajasthan",
      country: "IN",
      status: 1,
      terms_accepted: true,
      is_direct_paid: true,
      is_passive_paid: true,
      is_root: true,
      uuid: randomUUID(),
    };

    const password = "ChangeMe@123";
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(password, salt);

    const user = new User(userData);

    await user.save();

    // Create a wallet for the user
    const wallet = new Wallet({
      user: user._id,
      balance: 0,
    });

    await wallet.save();

    console.log("User created");

    process.exit(1);
  });
};

// loadFirstAdminUser();
