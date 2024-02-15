const express = require("express");
const router = express.Router();
const { chats } = require("../dummydata/data");
const { allUsers, logout } = require("../controllers/userController");
const {
  accessChat,
  fetchChats,
  creatGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  updatePic,
} = require("../controllers/chatcontrollers");
// const { sendMessages } = require('../controllers/messagecontroller');
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessages,
  allMessages,
} = require("../controllers/messagecontroller");
const { uploadFileToS3, upload } = require("../middleware/s3Upload");
const asyncHandler = require("express-async-handler");
var User = require("../models/userModel");

router.route("/search").post(protect, allUsers);
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, creatGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.post("/send", protect, sendMessages);

router.route("/updateProfilePic").post(
  upload.single("profilePic"),
  protect,
  asyncHandler(async (req, res, next) => {
    // const { userId } = req.body;
    const userId = req.user.id;
    console.log(userId);
    console.log(req.file);
    console.log(req.body);
    var pic =
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    if (req.file) {
      const bucketName = process.env.AWS_BUCKET_NAME;
      pic = await uploadFileToS3(bucketName, req.file);
    }

    if (!userId) {
      res.status(400);
      throw new Error("User ID is required");
    }

    const updatedPic = await User.findByIdAndUpdate(
      userId,
      {
        pic,
      },
      {
        new: true,
      }
    );
    // .populate("users", "-password");

    if (!updatedPic) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.redirect("/chats");
    }
  })
);

router.route("/sendDocuments").post(
  upload.single("document"),
  protect,
  asyncHandler(async (req, res, next) => {
    // console.log(req.file);
    // console.log(req.body);
    var pic = "Failed to upload File";
    if (req.file) {
      const bucketName = process.env.AWS_BUCKET_NAME;
      pic = await uploadFileToS3(bucketName, req.file);
    }
    // var d = {};
    // d.pic = pic;

    res.json(pic);
  })
);

router.route("/:chatId").post(protect, allMessages);
router.route("/logout").get(protect, logout);

module.exports = router;
