const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  //   console.log("in auth");
  const token = req.cookies.access_token;
  //   console.log("entered protect for", req.originalUrl);
  if (!token) {
    return res.status(403).send({ success: false, message: "Bad Request" });
  }

  try {
    const decoded = jwt.verify(token, "DarwinBox");
    // console.log(decoded);
    if (decoded?.id == null) {
      return res.status(403).send({ success: false, message: "Bad Request" });
    }
    // console.log(token);
    req.user = await User.findById(decoded.id).select("-password");
    // console.log(req.user);
    // console.log("calling next");
    next();
  } catch (err) {
    console.log("Error in protect middleware:");
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
  // let token;

  // if (
  //     req.headers.authorization &&
  //     req.headers.authorization.startsWith("Bearer")
  // ) {
  //     try {
  //         token = req.headers.authorization.split(" ")[1];

  //         const decoded = jwt.verify(token, "DarwinBox");

  //         req.user = await User.findById(decoded.id).select("-password");

  //         next();
  //     } catch (error) {
  //         res.status(401);
  //         throw new Error("Not authorizedm token failed");
  //     }
  // }

  // if (!token) {
  //     res.status(401);
  //     throw new Error("Not authorized, no token");
  // }
});

module.exports = { protect };
