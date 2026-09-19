const mongoose = require("mongoose");
const { MONGO_URI } = require("../config/config");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
  } catch (err) {
    console.log("Unable to connect DB", err);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
