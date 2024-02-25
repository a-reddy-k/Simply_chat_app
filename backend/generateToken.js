const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  if (!id) {
    throw new Error("id is required");
  }
  return jwt.sign({ id }, "DarwinBox", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
