var express = require("express");
const asyncHandler = require("express-async-handler");
var User = require("../models/userModel");
var generateToken = require("../generateToken");
const { registerUser } = require("../controllers/userController");
const { uploadFileToS3, upload } = require("../middleware/s3Upload");
const sendMail = require("../controllers/nodeMailerController");

// var data= require('../dummydata/data')

var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     //   res.send('respond with a resource');
//     res.render('signup',{});
// });

router
  .route("/")
  .post(
    upload.single("profilePic"),
    asyncHandler(async (req, res, next) => {
      const { name, password, email } = req.body;
      //   console.log(profilePic);
      var pic =
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
      console.log(req.file);
      console.log(req.body);
      if (req.file) {
        const bucketName = process.env.AWS_BUCKET_NAME;
        pic = await uploadFileToS3(bucketName, req.file);
      }

      console.log(name, password, email);

      if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all details");
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        res.status(400);
        throw new Error("User already exists");
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
        // alert("Account created");
        // res.status(201).json({
        //     _id: user._id,
        //     name: user.name,
        //     password:user.password,
        //     email: user.email,
        //     pic: user.pic,

        //     token: generateToken(user._id),
        // });
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
