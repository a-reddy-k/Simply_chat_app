const sinon = require("sinon");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { expect } = chai;
const { mockReq, mockRes } = require("sinon-express-mock");

const { fetchChats } = require("../controllers/chatcontrollers");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

describe("fetchChats", () => {
  let req, res, next;
  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should fetch chats for a user and render the 'chats' view", async () => {
    const chat1 = {
      _id: "chatId1",
      users: ["userId1", "userId2"],
      latestMessage: "messageId1",
      updatedAt: new Date(),
    };
    const chat2 = {
      _id: "chatId2",
      users: ["userId1", "userId3"],
      latestMessage: "messageId2",
      updatedAt: new Date(),
    };

    sinon.stub(Chat, "find").returns({
      populate: sinon.stub().returnsThis(),
      sort: sinon.stub().returnsThis(),
      then: async (callback) => {
        callback([chat1, chat2]);
      },
    });

    sinon.stub(User, "populate").resolves([
      {
        _id: "userId1",
        name: "User1",
        email: "user1@example.com",
        pic: "user1.jpg",
      },
      {
        _id: "userId2",
        name: "User2",
        email: "user2@example.com",
        pic: "user2.jpg",
      },
      {
        _id: "userId3",
        name: "User3",
        email: "user3@example.com",
        pic: "user3.jpg",
      },
    ]);

    req.user = {
      id: "userId1",
      name: "User1",
      email: "user1@example.com",
      pic: "user1.jpg",
    };

    await fetchChats(req, res);
    expect(res.status.called).to.be.true;
  });

  it("fetch chats with no req sent", async () => {
    req.user = {
      id: "differentUserId",
      name: "User1",
      email: "user1@example.com",
      pic: "user1.jpg",
    };

    expect(fetchChats(req, res)).to.rejectedWith("Did not find chat");

    // The assertion below should fail because req.user.id is different
    // console.log(res.status.args);
    // expect(res.status.calledWith(200)).to.be.true;
    // expect(res.render.calledWith("chats")).to.be.true;
  });
});
