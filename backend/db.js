const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xfmaxlc.mongodb.net/Chat?retryWrites=true&w=majority`;

  try {
    mongoose.connect(uri);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected`);
  });
  dbConnection.on("erroe", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
};

module.exports = { connectDB };
