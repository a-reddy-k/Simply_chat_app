const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Chat = require("../models/chatModel");

const {
  sendMessages,
  allMessages,
} = require("../controllers/messagecontroller");
const { populate } = require("dotenv");

describe("sendMessages", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        _id: "123",
      },
      body: {
        content: "Hello",
        chatId: "456",
      },
    };

    res = {
      json: sinon.spy(),
      sendStatus: sinon.spy(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 if no content or chatId", async () => {
    req.body = {};

    await sendMessages(req, res);

    expect(res.sendStatus.calledWith(400)).to.be.true;
  });

  it("should create and return a message", async () => {
    sinon.stub(mongoose.Model, "create").resolves({
      populate: sinon.stub().resolves({
        populate: sinon.stub().resolves({
          populate: sinon.stub().resolves({
            sender: { name: "John", pic: "avatar.png" },
            chat: { users: [{ name: "Jane" }] },
          }),
        }),
      }),
    });

    sinon.stub(Chat, "findByIdAndUpdate").resolves({ chatId: "456" });

    await sendMessages(req, res);

    expect(res.json.calledOnce).to.be.true;
  });

  it("should handle errors", async () => {
    sinon.stub(mongoose.Model, "create").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().returns({
          populate: sinon.stub().resolves({
            sender: { name: "John", pic: "avatar.png" },
            chat: { users: [{ name: "Jane" }] },
          }),
        }),
      }),
    });
    sinon.stub(Chat, "findByIdAndUpdate").resolves(null);
    try {
      await sendMessages(req, res);
    } catch (error) {
      expect(error.message).to.deep.equal("Failed to get chat");
    }
  });
});

describe("allMessages", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        chatId: "123",
      },
    };

    res = {
      json: sinon.spy(),
      status: sinon.spy(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return messages for chat", async () => {
    sinon.stub(mongoose.Model, "find").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves([
          {
            sender: { name: "John" },
          },
        ]),
      }),
    });

    await allMessages(req, res);

    expect(res.json.calledOnce).to.be.true;
  });

  it("should handle errors", async () => {
    sinon.stub(mongoose.Model, "find").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves(null),
      }),
    });
    try {
      await allMessages(req, res);
    } catch (error) {
      expect(res.status.calledWith(400)).to.be.true;
      expect(error.message).to.deep.equal("No messages found");
    }
  });
});
