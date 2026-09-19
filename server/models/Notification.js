const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    messageID: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    addTime: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      required: true,
      enum: [0, 1], // 0 for unread, 1 for read
    },
    stateName: {
      type: String,
      required: true,
      enum: ["unread", "read"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    messages: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.pre("save", function (next) {
  if (this.state === 0 && this.stateName !== "unread") {
    this.stateName = "unread";
  } else if (this.state === 1 && this.stateName !== "read") {
    this.stateName = "read";
  }
  next();
});

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = Notification;
