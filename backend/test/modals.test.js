const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const mongoose = require("mongoose");
const ValidationError = mongoose.Error.ValidationError;

var User = require("../models/userModel");
var Message = require("../models/messageModel");
var Chat = require("../models/chatModel");
// -----------------USER MODEL-------------------
describe("Testing User model", () => {
  let sampleUserVal;
  beforeEach(() => {
    sampleUserVal = {
      name: "akshay",
      password: "Akshay",
      email: "sampleEmail@gmail.com",
      pic: "profile.png",
    };
  });
  it("it should throw an error due to missing fields", async () => {
    let user = new User();
    try {
      await user.validate();
      throw new Error("Validation succeeded unexpectedly");
    } catch (err) {
      console.log(err);
      // Validation failed, as expected
      expect(err.errors.name).to.exist;
      expect(err.errors.password).to.exist;
      expect(err.errors.email).to.exist;
      expect(err.errors.pic).to.exist;
    }
  });

  it("it should create the item successfully with correct parameters", (done) => {
    let user = new User(sampleUserVal);
    user
      .validate()
      .then(() => {
        done();
      })
      .catch((err) => {
        throw new Error("⚠️ Unexpected failure!");
      });
  });
});

//----------------------Message Modal-----------------

describe("Testing Message model", () => {
  let sampleMessageVal;
  beforeEach(() => {
    sampleMessageVal = {
      sender: new mongoose.Types.ObjectId("611337ee1c066b46e4770365"),
      content: "Hello",
      chat: new mongoose.Types.ObjectId("611337ee1c066b46e4770365"),
    };
  });
  let saveStub;

  before(() => {
    saveStub = sinon.stub(mongoose.Model.prototype, "save");
  });

  after(() => {
    saveStub.restore();
  });

  it("it should throw an error due to missing fields", async () => {
    let msg = new Message();
    try {
      await msg.validate();
      throw new Error("Validation succeeded unexpectedly");
    } catch (err) {
      console.log(err);
      // Validation failed, as expected
      expect(err.errors.sender).to.exist;
      expect(err.errors.chat).to.exist;
    }
  });

  it("it should create the message successfully with correct parameters", async () => {
    let msg = new Message(sampleMessageVal);
    await msg.save();
    console.log(msg);
    expect(saveStub.calledOnce).to.be.true;
    expect(msg.sender).to.be.equal(sampleMessageVal.sender);
    expect(msg.content).to.be.equal(sampleMessageVal.content);
  });
});

//--------------------------Chat Model-----------------

describe("Chat Model", () => {
  let saveStub;

  before(() => {
    saveStub = sinon.stub(mongoose.Model.prototype, "save");
  });

  after(() => {
    saveStub.restore();
  });

  it("should create a new chat with valid parameters", async () => {
    const sampleChatVal = {
      chatName: "Group Chat",
      isGroupChat: true,
      users: ["611337ee1c066b46e4770365", "611337ee1c066b46e4770366"],
      latestMessage: "611337ee1c066b46e4770367",
      groupAdmin: "611337ee1c066b46e4770365",
    };

    const chat = new Chat(sampleChatVal);
    await chat.save();

    expect(saveStub.calledOnce).to.be.true;
    expect(chat.chatName).to.equal(sampleChatVal.chatName);
    expect(chat.isGroupChat).to.equal(sampleChatVal.isGroupChat);
    expect(chat.users).to.deep.equal(
      sampleChatVal.users.map((userId) => new mongoose.Types.ObjectId(userId))
    );
    expect(chat.latestMessage).to.deep.equal(
      new mongoose.Types.ObjectId(sampleChatVal.latestMessage)
    );
    expect(chat.groupAdmin).to.deep.equal(
      new mongoose.Types.ObjectId(sampleChatVal.groupAdmin)
    );
  });

  it("should throw an error if required fields are missing", async () => {
    const chat = new Chat({
      //   chatName: "Group Chat",
      //   isGroupChat: true,
    });

    let error;
    try {
      await chat.save();
      console.log(chat);
    } catch (err) {
      error = err;
    }
    // console.log(error);
    expect(error).to.exist;
  });
});
