const mongoose = require("mongoose");

const UserUplineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    uplines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserUpline = mongoose.model("user_uplines", UserUplineSchema);

module.exports = UserUpline;
