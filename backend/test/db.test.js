const mongoose = require("mongoose");
const sinon = require("sinon");
const { expect } = require("chai");
const { connectDB } = require("../db");

describe("connectDB", () => {
  let connectStub;

  it("should connect to the database with the correct URI", async () => {
    connectStub = sinon.stub(mongoose, "connect");
    const uri = `mongodb+srv://username:password@cluster0.xfmaxlc.mongodb.net/Chat?retryWrites=true&w=majority`;
    process.env.MONGODB_USERNAME = "username";
    process.env.MONGODB_PASSWORD = "password";

    await connectDB();

    expect(connectStub.calledOnce).to.be.true;
    expect(connectStub.firstCall.args[0]).to.equal(uri);
    connectStub.restore();
  });

  it("should handle connection error", async () => {
    sinon.stub(mongoose, "connect").throws(new Error("connection error"));
    const exitStub = sinon.stub(process, "exit");

    await connectDB();
    expect(exitStub.calledOnce).to.be.true;
    exitStub.restore();
    mongoose.connect.restore();
  });
});
