const QRCode = require("qrcode");
const crypto = require("crypto");

const generateQRCodeWithAmount = async (upi, payeeName, amount) => {
  try {
    const transactionRef = crypto.randomBytes(16).toString("hex").slice(0, 20);
    const token = crypto.randomBytes(16).toString("hex");

    const upiUrl = `upi://pay?pa=${upi}&pn=${encodeURIComponent(
      payeeName
    )}&tr=${transactionRef}&am=${amount}&cu=INR&tn=${token}`;

    // Generate QR code as a base64 string
    const qrCodeData = await QRCode.toDataURL(upiUrl);

    return { qrCodeData, transactionRef, token };
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

module.exports = {
  generateQRCodeWithAmount,
};
