const puppeteer = require("puppeteer");
const moment = require("moment");
const default_invoice_templates = require("./invoiceTemplate.js");

const generateInvoice = async (invoiceData) => {
  try {
    let invoiceHtml = default_invoice_templates.invoice_html;

    const customerAdd = `${invoiceData?.userDetails?.address}, 
    ${invoiceData?.userDetails?.city}, ${invoiceData?.userDetails?.state}, ${invoiceData?.userDetails?.country}
    ${invoiceData?.userDetails?.pin_code}`;

    const adminAddress = `${invoiceData?.adminDetails?.address}, 
    ${invoiceData?.adminDetails?.city}, ${invoiceData?.adminDetails?.state} - ${invoiceData?.adminDetails?.pin_code}`;

    // Replace placeholders with actual data
    invoiceHtml = invoiceHtml
      .replace("{{order_id}}", invoiceData.order_id)
      .replace("{{invoice_order_id}}", invoiceData.order_id)
      .replace("{{invoice_date}}", moment().format("llll"))
      .replace("{{customer_name}}", invoiceData.name)
      .replace("{{customer_address}}", customerAdd)
      .replace("{{customer_mobile}}", invoiceData?.userDetails?.ccode_phone)
      .replace("{{sa_id}}", invoiceData?.userDetails?.SA_ID)

      .replace("{{company_name}}", invoiceData?.adminDetails?.name)
      .replace("{{company_address}}", adminAddress)
      .replace("{{company_gst}}", invoiceData?.adminDetails?.gst || "XXAAAAA0000A1Z5")

      .replace("{{total_amount}}", invoiceData.full_amount)
      .replace("{{invoice_order_id}}", invoiceData.order_id)
      .replace("{{order_amount}}", invoiceData.amount)
      .replace("{{order_full_amount}}", invoiceData.full_amount);

    // Generate order items in a descriptive format
    let orderItemsHtml = "";
    invoiceData.order_items.forEach((item, index) => {
      orderItemsHtml += `<p>${
        index + 1
      }. ${item?.service?.title.toUpperCase()}${
        item?.quality ? `(${item?.quality})` : ""
      }, Qyt: ${item.quantity}, Amount: Rs. ${item.amount}</p>`;
    });

    // Replace order items placeholder
    invoiceHtml = invoiceHtml.replace("{{order_items}}", orderItemsHtml);

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(invoiceHtml);

    // Generate PDF as a Buffer
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();
    console.log("Invoice PDF generated in memory");

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating invoice:", error);
    throw new Error("Error generating invoice.");
  }
};

module.exports = { generateInvoice };
