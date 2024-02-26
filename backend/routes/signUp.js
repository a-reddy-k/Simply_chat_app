var express = require("express");
const asyncHandler = require("express-async-handler");
var User = require("../models/userModel");
const { uploadFileToS3, upload } = require("../middleware/s3Upload");
const sendMail = require("../controllers/nodeMailerController");

var router = express.Router();

router
  .route("/")
  .post(
    upload.single("profilePic"),
    asyncHandler(async (req, res, next) => {
      const { name, password, email } = req.body;
      var pic =
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

      if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all details");
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        res.status(400);
        throw new Error("User already exists");
      }

      if (req.file) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        pic = await uploadFileToS3(bucketName, req.file);
      }
      console.log(pic);

      const user = await User.create({
        name,
        password,
        email,
        pic,
      });

      // console.log(user);
      if (user) {
        console.log("account created");
      } else {
        res.status(400);
        throw new Error("Failed to create the User");
      }

      const html = `
       <h1>SignUp Successful</h1>
      <p>Your Account was created successful. Welcome!</p>
      <p>Login to proceed</p>
      `;

      sendMail("SignUp successfull", email, html);

      res.redirect("/");
    })
  )
  .get((req, res) => {
    res.render("signup");
  });

module.exports = router;
