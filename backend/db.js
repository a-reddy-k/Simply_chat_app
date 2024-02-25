const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xfmaxlc.mongodb.net/Chat?retryWrites=true&w=majority`;

  try {
    mongoose.connect(uri);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
  return;
};

module.exports = { connectDB };
