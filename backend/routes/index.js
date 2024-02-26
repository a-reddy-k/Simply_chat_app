var express = require("express");
var router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../generateToken");
const sendMail = require("../controllers/nodeMailerController");

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.send(chat);
  res.render("index");
});

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    // console.log(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      var token = generateToken(user._id);
      console.log(token);
      res.cookie("access_token", token, {
        secure: true,
        httpOnly: true,
        maxAge: 3600000 * 24,
      });

      // console.log(email);

      const html = `
       <h1>Login Successful</h1>
      <p>Your login was successful. Welcome back!</p>
      `;

      sendMail("Login Detected", email, html);

      res.redirect("/chats");
    } else {
      res.send("invalid credentials");
    }
  })
);

module.exports = router;
