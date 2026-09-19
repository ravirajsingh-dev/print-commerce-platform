const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
var cors = require("cors");
const { morgan } = require("./middleware/morgan");

connectDB();
const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: true, limit: "150mb" })); // Used to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); //Parse URL-encoded bodies

// Morgan part
const originalSend = app.response.send;
app.response.send = function sendOverride(body) {
  this.responseBody = body;
  return originalSend.call(this, body);
};
app.use(
  morgan(
    ':requester :remote-addr [:date[clf]] ":method :url HTTP/:http-version" ' // Input :input Response :response-body
  )
);
// Morgan part

app.use("/api/forgot-password", require("./routes/User/Auth/forgotPassword"));
app.use("/api/auth/users", require("./routes/User/Auth/authUser"));
app.use("/api/auth", require("./routes/Admin/Auth/auth"));
app.use("/api/admin/users", require("./routes/Admin/userRoutes"));
app.use(
  "/api/admin/forgot-password",
  require("./routes/Admin/Auth/forgotPassword")
);
app.use("/api/admin/orders", require("./routes/Admin/orderRoutes"));
app.use("/api/admin/dashboard", require("./routes/Admin/dashboardRoutes"));
app.use("/api/admin/services", require("./routes/Admin/serviceRoutes"));
app.use("/api/admin/products", require("./routes/Admin/productRoutes"));
app.use("/api/admin/credentials", require("./routes/Admin/credentialRoutes"));
app.use("/api/admin/wallet", require("./routes/Admin/walletRequestRoutes"));
app.use(
  "/api/admin/product-services",
  require("./routes/Admin/productServiceRoutes")
);
app.use("/api/admin/complaints", require("./routes/Admin/complaintRoutes"));

app.use(
  "/api/admin/service-categories",
  require("./routes/Admin/serviceCatRoutes")
);
app.use("/api/admin/users", require("./routes/Admin/userRoutes"));
app.use("/api/admin/banners", require("./routes/Admin/bannerRoutes"));

app.use("/api/common", require("./routes/Admin/commonRoutes"));

//User Routes
app.use("/api/users", require("./routes/User/users"));
app.use("/api/wallet", require("./routes/User/walletRoutes"));

app.use("/api/user/dashboard", require("./routes/User/dashboardRoutes"));
app.use("/api/user/credentials", require("./routes/User/credentialRoutes"));
app.use("/api/user/orders", require("./routes/User/orderRoutes"));
app.use("/api/user/complaints", require("./routes/User/complaintRoutes"));

app.get("/api", (req, res) => {
  res.send({ Hello: "Text!" });
});

app.use((req, res) => {
  console.log(req.body); // this is what you want

  res.on("finish", () => {
    console.log(res);
  });
});

const port = process.env.APP_API_PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
