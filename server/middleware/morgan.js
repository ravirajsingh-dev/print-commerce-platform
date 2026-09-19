const morgan = require("morgan");
const Log = require("../models/Log");

morgan.token("requester", (req, res) => {
  const xAuthToken = req.header("x-auth-token");
  const xAppToken = req.header("x-app-token");
  const xAccessToken = req.header("x-access-token");
  const ip = req.socket.remoteAddress;
  // const ip3 = req.ip;

  const originalUrl = req.originalUrl;

  let baseUrl = req.baseUrl;
  baseUrl = baseUrl.replace("/", "");

  let path = req.url.replace(/\?.*$/, "");
  path = path.replace("/", ""); // replace initial slash (/)

  let level = "WebApp";
  if (xAppToken || xAccessToken) {
    level = "Client";
  }

  const method = req.method;
  const statusCode = res.statusCode;
  const body = req.body;
  const params = req.params;
  const response = res.responseBody ? JSON.parse(res.responseBody) : {};

  if (level === "Client") {
    const data = {
      originalUrl,
      baseUrl,
      endPoint: path,
      method,
      authToken: xAuthToken,
      appToken: xAppToken,
      accessToken: xAccessToken,
      ip,
      statusCode,
      level,
      body: body,
      params: params,
      response: response,
    };
    Log.create(data);
  }

  return JSON.stringify(req.requester);
});

module.exports = { morgan };
