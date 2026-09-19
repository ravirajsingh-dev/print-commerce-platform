const User = require("../models/User");
const PaymentLink = require("../models/PaymentLink");

const deactivateLast5DaysInactiveUsers = async () => {
  console.log(
    "******* Deactivating User of last 5 days CRON JOB START ********"
  );

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  let inactiveUsers = await User.find({
    status: 3,
    createdAt: { $lt: fiveDaysAgo },
  }).lean();

  inactiveUsers.forEach(async (user) => {
    await User.findByIdAndUpdate(user._id, { status: 2 });

    const userPaymentLinks = await PaymentLink.find({
      sender: user._id,
    }).lean();

    userPaymentLinks.forEach(async (paymentLink) => {
      switch (paymentLink.payment_type) {
        case "Direct":
          await PaymentLink.findByIdAndDelete(paymentLink._id);
          break;
        case "Passive":
          await PaymentLink.findByIdAndUpdate(paymentLink._id, {
            $set: { sender: null, sender_status: "pending" },
          });
          break;
      }
    });
  });

  console.log("******* RECURRING ORDER CRON JOB END ********");
};

module.exports = deactivateLast5DaysInactiveUsers;
