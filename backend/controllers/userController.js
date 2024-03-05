const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const allUsers = asyncHandler(async (req, res, next) => {
  try {
    const { q } = req.body;
    if (!q) {
      throw new Error("No query provided");
    }
    const users = await User.aggregate([
      {
        $search: {
          index: "searchTrail",
          autocomplete: {
            query: q,
            path: "name"
          }
        }
      },
    ]);
    res.json(users);
  } catch (error) {
    throw new Error(error.message);
  }
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

module.exports = { allUsers, logout };
