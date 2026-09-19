const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/User");
const Admin = require("../models/Admin");

module.exports = {
  Admin: function (req, res, next) {
    //get the token from header
    const token = req.header("x-auth-token");

    //check if it has token or not
    if (!token) {
      return res
        .status(401)
        .json({ msg: "Invalid auth or token expired.", tokenStatus: 0 });
    }

    try {
      jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
        if (err || !decoded)
          return res.status(401).json({ msg: "Invalid token", tokenStatus: 0 });

        req.user = decoded.user;

        const doc = await Admin.findOne({
          _id: decoded.user.id,
          uuid: decoded.user.uuid,
          // role: constants.USER_ROLE.ADMIN,
        });

        // Add user data to request
        req.userObj = doc;
        if (err || !doc) {
          return res.status(401).json({
            msg: "Authorization failed. Contact Support.",
            tokenStatus: 0,
          });
        }
        if (doc.status !== 1) {
          return res.status(403).json({
            msg: "User is not allowed to Login. Contact Support.",
            tokenStatus: 0,
          });
        }
        next();
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server Error", tokenStatus: 0 });
    }
  },
  User: function (req, res, next) {
    //get the token from header
    const token = req.header("x-auth-token");

    //check if it has token or not
    if (!token) {
      return res
        .status(401)
        .json({ msg: "Invalid auth or token expired.", tokenStatus: 0 });
    }

    try {
      jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
        if (err || !decoded)
          return res.status(401).json({ msg: "Invalid token", tokenStatus: 0 });

        req.user = decoded.user;

        const doc = await User.findOne({
          _id: decoded.user.id,
          uuid: decoded.user.uuid,
          // role: constants.USER_ROLE.ADMIN,
        });

        // Add user data to request
        req.userObj = doc;

        // if (err || !doc) {
        //   return res.status(401).json({
        //     msg: "Authorization failed. Contact Support.",
        //     tokenStatus: 0,
        //   });
        // }
        // if (doc.status !== 1) {
        //   return res.status(403).json({
        //     msg: "User is not allowed to Login. Contact Support.",
        //     tokenStatus: 0,
        //   });
        // }
        next();
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server Error", tokenStatus: 0 });
    }
  },
};
