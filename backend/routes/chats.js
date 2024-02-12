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
} = require("../controllers/chatcontrollers");
// const { sendMessages } = require('../controllers/messagecontroller');
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessages,
  allMessages,
} = require("../controllers/messagecontroller");

// Define a route for rendering the chat details
// router.get('/:chatId', (req, res) => {
//   const chatId = req.params.chatId;
//   const chat = chats.find(chat => chat._id === chatId);

//   if (!chat) {
//     res.status(404).send('Chat not found');
//     return;
//   }

//   res.render('chats', { chat });
// });

// router.get('/', (req, res) => {
//   console.log("request recievied");
//   res.status(200).send("message sent");
// })

router.route("/search").post(protect, allUsers);
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, creatGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

// router.route("/send").post(sendMessages);
router.post("/send", protect, sendMessages);
router.route("/:chatId").post(protect, allMessages);

router.route("/logout").get(protect, logout);

module.exports = router;
