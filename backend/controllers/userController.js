const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../generateToken");
const mongoose = require("mongoose");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all details");
  }

  const userExists = await User.findOne(email);

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,

      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
});

const allUsers = asyncHandler(async (req, res, next) => {
  try {
    const { q } = req.body;
    // console.log(q);

    const users = await User.aggregate([
      {
        $search: {
          index: "userSearchIndex",
          text: {
            query: q,
            path: {
              wildcard: "*",
            },
          },
        },
      },
    ]);
    // console.log(users);
    res.json(users);
  } catch (error) {
    throw new Error(error.message);
  }
  // console.log(users)
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

module.exports = { registerUser, allUsers, logout };
