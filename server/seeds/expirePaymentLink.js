const User = require("../models/User");
const PaymentLink = require("../models/PaymentLink");

// Not for use, it is in pending status
const expirePaymentLink = async () => {
  console.log(
    "******* Deactivating Payment of last 5 days CRON JOB START ********"
  );

  const todayDate = new Date();

  let paymentLinks = await PaymentLink.find({
    expiry: { $lt: todayDate },
  }).lean();

  paymentLinks.forEach(async (paymentLink) => {
    await PaymentLink.findByIdAndUpdate(paymentLink._id, { expired: true });

    const senderDetails = await User.findById(paymentLink.sender).lean();

    await User.findByIdAndUpdate(senderDetails._id, {});
  });

  console.log("******* RECURRING ORDER CRON JOB END ********");
};

module.exports = expirePaymentLink;
