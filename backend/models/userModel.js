const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pic: {
    type: String,
    required: true,
  },
});

userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userModel.methods.matchPassword = async function (enteredPassword) {
  const r = await bcrypt.compare(enteredPassword, this.password);
  console.log(r);
  return r;
};

const User = mongoose.model("User", userModel);

module.exports = User;
