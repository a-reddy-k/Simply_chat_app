const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId);

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat);
    } catch (error) {
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        results.uId = req.user.id;
        results.name = req.user.name;
        results.email = req.user.email;
        results.pic = req.user.pic;
        console.log(typeof results[0]);

        res.status(200).render("chats", { results });
      });
  } catch (error) {
    throw new Error("Did not find chat");
  }
});

const creatGroupChat = asyncHandler(async (req, res) => {
  console.log("in create grp controller");
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }
  console.log("recived all data");
  console.log(req.body.users, req.body.name);
  //   console.log(JSON.parse(req.body.users));
  var users = req.body.users;
  //   console.log(users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More that 2 users are required to form a group");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  console.log(req.body);

  const chat = await Chat.findOne(chatId);
  if (req.user.id === chat.groupAdmin) {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  } else {
    res.send("You Are Not Admin");
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { chatId, userId } = req.body;
  const chat = await Chat.findOne(chatId);
  if (req.user.id === chat.groupAdmin) {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      if (removed.users.length < 2) {
        await Chat.findByIdAndDelete(chatId);
      }
      res.json(removed);
    }
  } else {
    res.send("You Are Not Admin");
  }
});

const updatePic = asyncHandler(async (req, res, next) => {
  const { userId, pic } = req.body;

  const updatedPic = await Chat.findByIdAndUpdate(
    userId,
    {
      pic,
    },
    {
      new: true,
    }
  ).populate("users", "-password");

  if (!updatedPic) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedPic);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  creatGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  updatePic,
};
