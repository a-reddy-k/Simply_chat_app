const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).send({ success: false, message: "Bad Request" });
  }

  try {
    const decoded = jwt.verify(token, "DarwinBox");
    // console.log(decoded);
    if (decoded?.id == null) {
      return res.status(403).send({ success: false, message: "Bad Request" });
    }
    // console.log("Decoded token:", decoded);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.log("Error in protect middleware:");
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
});

module.exports = { protect };
