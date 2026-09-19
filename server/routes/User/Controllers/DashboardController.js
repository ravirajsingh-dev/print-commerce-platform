const response = require("../../../config/response");
const User = require("../../../models/User");
const UserUpline = require("../../../models/UserUpline");
const PaymentLink = require("../../../models/PaymentLink");
const Wallet = require("../../../models/Wallet");

// @desc Get dashboard details
const getDashboardDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("H2C_ID user_level");

    if (!user) {
      return response.errorResponse(
        res,
        { msg: "User not found." },
        "User not found.",
        400
      );
    }

    const { H2C_ID, user_level } = user;

    // Count of direct users for the specific sponsorID
    const directUsersCount = await User.countDocuments({
      sponsorH2C: H2C_ID,
    });

    const userWalletInfo = await Wallet.findOne({
      user: userId,
    });

    if (!userWalletInfo) {
      return response.errorResponse(
        res,
        { msg: "User wallet not found." },
        "User wallet not found.",
        400
      );
    }

    const totalUsers = await User.countDocuments({});

    const totalUserTeam = await UserUpline.countDocuments({
      uplines: { $in: user },
    });

    const stats = await PaymentLink.aggregate([
      {
        $match: { receiver: user._id },
      },
      {
        $group: {
          _id: null,
          totalPendingApprovals: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver_status", "pending"] },
                    { $eq: ["$sender_status", "paid"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalPendingSends: {
            $sum: {
              $cond: [
                {
                  $and: [{ $eq: ["$sender_status", "pending"] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Destructure results safely
    const [result] = stats;
    const totalPendingApprovals = result?.totalPendingApprovals || 0;
    const totalPendingSends = result?.totalPendingSends || 0;

    return response.successResponse(
      res,
      {
        totalReceived:
          userWalletInfo?.direct_received +
          userWalletInfo?.passive_received +
          userWalletInfo?.upgrade_received,
        direct_received: userWalletInfo?.direct_received || 0,
        passive_received: userWalletInfo?.passive_received || 0,
        upgrade_received: userWalletInfo?.upgrade_received || 0,
        totalUsers,
        userTeam: totalUserTeam,
        totalPendingApprovals,
        totalPendingSends,
      },
      "Dashboard details fetched successfully."
    );
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return response.errorResponse(res, {}, "Server Error", 500);
  }
};

module.exports = {
  getDashboardDetails,
};
