const _ = require("lodash");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const { generateRandomString } = require("./helper");
const { VITE_SERVER_URL } = require("../config/config");

const PaymentLink = require("../models/PaymentLink");
const Credential = require("../models/Credential");
const User = require("../models/User");
const UserUpline = require("../models/UserUpline");
const { Level } = require("../models/Level");
const { getSetting } = require("../models/Setting");
const { passive_income } = require("./constants");

const sendPaymentLinkToCommunity = async (user, linkDetails) => {
  try {
    const community_id = await getSetting("_community_root_id");
    createPaymentLink(
      community_id,
      user._id,
      linkDetails.bits,
      linkDetails.bits_type
    );
  } catch (error) {
    console.error("Error sending payment link to community:", error.message);
  }
};

// Optimized function to find the immediate available position for a new user
const findAvailablePosition = async (sponsorBy, position) => {
  if (position === "left") {
    if (!sponsorBy.left_leg) {
      return { user: sponsorBy, position: "left" };
    }
  } else if (position === "right") {
    if (!sponsorBy.right_leg) {
      return { user: sponsorBy, position: "right" };
    }
  } else {
    throw new Error("Invalid position specified.");
  }

  // Start the search for available position in the subtree
  const rootUser =
    position === "left"
      ? await User.findById(sponsorBy.left_leg)
      : await User.findById(sponsorBy.right_leg);

  if (!rootUser) return;
  return fillSubtree(rootUser);
};

// Optimized function to fill subtrees using breadth-first search (BFS)
const fillSubtree = async (rootUser) => {
  const queue = [rootUser];

  while (queue.length > 0) {
    const currentUser = queue.shift();

    // Check if there's space in the current user's legs
    if (!currentUser.left_leg || !currentUser.right_leg) {
      return {
        user: currentUser,
        position: !currentUser.left_leg ? "left" : "right",
      };
    }

    // Fetch both left and right legs concurrently
    const [leftDownlineUser, rightDownlineUser] = await Promise.all([
      User.findById(currentUser.left_leg),
      User.findById(currentUser.right_leg),
    ]);

    // Add the next level of users to the queue for processing
    queue.push(leftDownlineUser, rightDownlineUser);
  }

  throw new Error("No available position found.");
};

const updateDirectSponsor = async (sponsorUser, newUser, position) => {
  if (!sponsorUser.i_added_to_left && position === "left") {
    sponsorUser.left_leg = newUser._id;
    sponsorUser.i_added_to_left = true;
  } else if (!sponsorUser.i_added_to_right) {
    sponsorUser.right_leg = newUser._id;
    sponsorUser.i_added_to_right = true;
  }
  sponsorUser.total_direct_users += 1;

  await sponsorUser.save();
};

const generatePassiveLink = async (
  receiverId,
  amount,
  paymentType,
  expiryDurationMinutes
) => {
  try {
    const upiDetailsOfSponsorID = await Credential.findOne({
      user: receiverId,
      primary: true,
    });

    if (!upiDetailsOfSponsorID) {
      throw new Error("Sponsor credentials not found");
    }

    const { name, phone, selectedMethod, upiId } = upiDetailsOfSponsorID;

    const expiryTime = new Date(Date.now() + expiryDurationMinutes * 60000);
    const transactionRef = crypto.randomBytes(16).toString("hex").slice(0, 20);
    const token = crypto.randomBytes(16).toString("hex");

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&tr=${transactionRef}&am=${amount}&cu=INR&tn=${token}`;

    const randomString = generateRandomString(6);
    const qrCodeFileName = `qr_${receiverId}_${upiId}_${phone}_${randomString}_${Date.now()}.png`;
    const qrCodeURL = `${VITE_SERVER_URL}/qrcodes/${qrCodeFileName}`;
    const outputPath = path.join(qrCodeOutputDir, qrCodeFileName);

    if (!fs.existsSync(qrCodeOutputDir)) {
      fs.mkdirSync(qrCodeOutputDir, { recursive: true });
    }

    await QRCode.toFile(outputPath, upiUrl);

    const paymentLinkDoc = new PaymentLink({
      receiverId,
      paymentLink: upiUrl,
      qrCode: qrCodeURL,
      amount,
      paymentType,
      expiryTime,
    });

    await paymentLinkDoc.save();

    return {
      paymentLinkId: paymentLinkDoc._id,
      upiUrl,
      qrCodeFileName,
      expiryTime,
      transactionRef,
      token,
    };
  } catch (error) {
    console.error("Error creating payment link and QR code:", error);
    throw error;
  }
};

const updateUserUpline = async (newUser) => {
  let user = newUser; // Assume this function fetches the initial value

  while (user) {
    if (!user) return;

    let parentUserOfParent = await User.findOne({
      $or: [{ left_leg: user._id }, { right_leg: user._id }],
    });

    if (!parentUserOfParent) return;

    if (_.isEqual(parentUserOfParent.left_leg, user._id)) {
      // child is in left downline
      await User.updateOne(
        {
          _id: parentUserOfParent._id,
        },
        {
          $inc: { total_left_users: 1 }, // Increment the count
        }
      );
    } else {
      // child is in right downline
      await User.updateOne(
        {
          _id: parentUserOfParent._id,
        },
        {
          $inc: { total_right_users: 1 }, // Increment the count
        }
      );
    }

    // Update the user after the action
    user = parentUserOfParent; // Fetch the updated value
  }
};
const isRatioComplete = (left, right, ratio_completed) => {
  return new Promise((resolve, reject) => {
    const minValue = Math.min(left, right);

    getSetting("ratio_list")
      .then((ratioList) => {
        if (minValue > ratio_completed) {
          const foundInArray = ratioList.find((element) => element == minValue);

          if (foundInArray) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching ratio_list:", error);
        reject(error); // Rejecting the promise if there's an error
      });
  });
};
const checkPassiveEligibilityAndGenerateLink = async (newUser) => {
  try {
    let currentUser = newUser;

    while (currentUser) {
      // Find the parent of the current user
      const parent = await User.findOne({
        $or: [{ left_leg: currentUser._id }, { right_leg: currentUser._id }],
      });

      if (!parent) return;

      const {
        i_added_to_left,
        i_added_to_right,
        total_left_users,
        total_right_users,
        ratio_completed = 0,
      } = parent;

      //TO check if the ratio is complete
      const isRatioDone = await isRatioComplete(
        total_left_users,
        total_right_users,
        parent.ratio_completed
      );

      if (i_added_to_left && i_added_to_right && isRatioDone) {
        const newRatioToBeGenerated = Math.min(
          total_left_users,
          total_right_users
        );

        // Generate passive income link
        await createPaymentLink(
          parent._id,
          null,
          passive_income,
          "Passive",
          48 * 60
        );

        // Update parent with the new passive eligibility counts
        parent.ratio_completed = newRatioToBeGenerated;

        await parent.save();
      }

      currentUser = parent;
    }
  } catch (error) {
    console.error("Error checking passive income eligibility:", error.message);
  }
};

const getUplineUsersArray = async (user) => {
  try {
    const uplineUsersArray = [];
    const uplineUser = await User.findOne({
      H2C_ID: user.sponsorH2C,
    });

    if (!uplineUser) {
      return uplineUsersArray;
    }

    uplineUsersArray.push(uplineUser._id);
    getUplineUsersArray(uplineUser);
  } catch (error) {
    console.error("Error assigning sender for passive payment:", error.message);
  }
};

const createPaymentLink = async (
  receiverId,
  senderId,
  amount,
  payment_type,
  expiryDurationMinutes = 48 * 60
) => {
  try {
    const expiryTime = new Date(Date.now() + expiryDurationMinutes * 60000);

    const paymentLinkDoc = new PaymentLink({
      receiver: receiverId,
      sender: senderId,
      amount,
      payment_type,
      expiry: expiryTime,
    });

    await paymentLinkDoc.save();

    return {
      paymentLinkId: paymentLinkDoc._id,
      expiryTime,
    };
  } catch (error) {
    console.error("Error creating payment link and QR code:", error);
    throw error;
  }
};

const assignSenderForPassivePayment = () => {};

const assignUplineForPayment = async (user, linkDetails) => {
  try {
    const uplines = await UserUpline.findOne({ user }).select("uplines");

    const lastPaymentPending = await PaymentLink.find({
      receiver: { $in: uplines.uplines },
      sender: { $eq: null },
      payment_type: linkDetails.bits_type,
      amount: { $eq: linkDetails.bits },
      status: "pending",
    })
      .sort({ createdAt: 1 })
      .limit(1);

    if (!lastPaymentPending?.length) {
      sendPaymentLinkToCommunity(user, linkDetails);
      return;
    }

    lastPaymentPending[0].sender = user._id;

    await lastPaymentPending[0].save();
  } catch (error) {
    console.error("Error assigning sender for passive payment:", error.message);
  }
};

const createPaymentLinkAsLevel = async (receiver, sender) => {
  try {
    const upiDetailsOfSponsorID = await Credential.findOne({
      user: receiver._id,
      primary: true,
    });

    if (!upiDetailsOfSponsorID) {
      throw new Error("Sponsor credentials not found");
    }

    const senderLevelLinks = await Level.findOne({
      level: sender.user_level,
    });

    if (!senderLevelLinks || !senderLevelLinks.bits_for_upgrade) {
      throw new Error("Level links not found");
    }

    senderLevelLinks.bits_for_upgrade.forEach(async (link) => {
      // createPaymentLink(receiver._id, sender._id, link.bits, link.bits_type);
      switch (link.bits_type) {
        case "Direct":
          createPaymentLink(
            receiver._id,
            sender._id,
            link.bits,
            link.bits_type
          );
          break;
        case "Passive":
        case "Upgrade":
          assignUplineForPayment(sender, link);
      }
    });
  } catch (error) {
    console.error("Error creating payment link and QR code:", error);
    throw error;
  }
};

const createUserPaymentLinks = async (receiver, sender) => {
  try {
    //Send payment link to the sponsor
    createPaymentLink(receiver._id, sender._id, 800, "Direct");

    assignSenderForPassivePayment(sender);
  } catch (error) {
    console.error("Error creating payment link", error);
    throw error;
  }
};

const createUserUplinesArray = async (user) => {
  try {
    const uplineUsersArray = [];
    let userInfo = user;
    while (userInfo) {
      const parent = await User.findOne({
        H2C_ID: userInfo.uplineH2C,
      });
      if (!parent) break;
      uplineUsersArray.push(parent._id);
      console.log("uplineUsersArray", uplineUsersArray);
      userInfo = parent;
    }

    console.log("uplineUsersArray Last", uplineUsersArray);
    const userUplineDoc = new UserUpline({
      user: user._id,
      uplines: uplineUsersArray,
    });

    await userUplineDoc.save();
  } catch (error) {
    console.error("Error in Creating User Upline array", error);
    throw error;
  }
};

module.exports = {
  findAvailablePosition,
  updateDirectSponsor,
  generatePassiveLink,
  updateUserUpline,
  isRatioComplete,
  checkPassiveEligibilityAndGenerateLink,
  assignSenderForPassivePayment,
  createPaymentLink,
  createPaymentLinkAsLevel,
  createUserPaymentLinks,
  createUserUplinesArray,
  assignUplineForPayment,
};
