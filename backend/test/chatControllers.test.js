const sinon = require("sinon");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { expect } = chai;
const { mockReq, mockRes } = require("sinon-express-mock");
const mongoose = require("mongoose");
const {
  fetchChats,
  accessChat,
  creatGroupChat,
  removeFromGroup,
  addToGroup,
  updatePic,
} = require("../controllers/chatcontrollers");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const e = require("express");

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

  it("fetch chats with no user present", async () => {
    req = mockReq({
      user: {
        id: "differentUserId",
        name: "User1",
        email: "user1@example.com",
        pic: "user1.jpg",
      },
      body: {
        userId: "userId1",
      },
    });

    sinon.stub(Chat, "find").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().returns({
          populate: sinon.stub().returns({
            sort: sinon.stub().resolves(null),
          }),
        }),
      }),
    });

    await fetchChats(req, res);
    expect(res.status.called).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
  });
});

//---------------------------------AccessChat-------------------------
describe("AccessChat", () => {
  let req, res, next;
  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 status when userId is not sent", async () => {
    req = mockReq({
      body: {},
    });

    await accessChat(req, res);

    expect(res.sendStatus.calledOnce).to.be.true;
    expect(res.sendStatus.calledWith(400)).to.be.true;
  });

  // it("if single chat is found, return the chat", async () => {
  //   const chat = {
  //     _id: "chatId1",
  //     users: ["userId1", "userId2"],
  //     latestMessage: "messageId1",
  //     updatedAt: new Date(),
  //   };
  //   const user = {
  //     _id: "userId1",
  //     name: "User1",
  //     email: "user1@example.com",
  //     pic: "user1.jpg",
  //   };
  //   req = mockReq({
  //     body: {
  //       userId: "userId2",
  //     },
  //     user: user,
  //   });
  //   sinon.stub(Chat, "find").returns({
  //     populate: sinon.stub().returns({
  //       populate: sinon.stub().resolves(chat),
  //     }),
  //   });

  //   sinon.stub(User, "populate").resolves([user]);
  //   sinon.stub(mongoose, "Types").returns({
  //     ObjectId: sinon.stub().returns("chatId1"),
  //   });

  //   await accessChat(req, res);
  //   expect(res.status.called).to.be.true;
  //   expect(res.status.calledWith(200)).to.be.true;
  //   expect(res.json.called).to.be.true;
  //   expect(res.json.calledWith(chat)).to.be.true;
  //   expect(next.called).to.be.false;
  // });
});

//---------------------------------Gropu Chat creation-------------------------

describe("Group Chat creation", () => {
  let req, res, next;
  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 status when userId is not sent", async () => {
    req = mockReq({
      body: {},
    });
    await creatGroupChat(req, res);
    expect(res.sendStatus.calledOnce).to.be.true;
    expect(res.sendStatus.calledWith(400)).to.be.true;
  });

  it("is users length is less than 2, return 400 status", async () => {
    req = mockReq({
      body: {
        name: "Group",
        users: ["userId1"],
      },
    });
    await creatGroupChat(req, res);

    expect(res.sendStatus.calledOnce).to.be.true;
    expect(res.sendStatus.calledWith(400)).to.be.true;
  });

  it("if users length is more than 2, return the group chat", async () => {
    req = mockReq({
      body: {
        name: "Group",
        users: ["userId1", "userId2", "userId3"],
      },
      user: {
        _id: "userId1",
        name: "User1",
        email: "user1@example.com",
        pic: "user1.jpg",
      },
    });

    sinon.stub(Chat, "create").resolves({
      _id: "chatId1",
      users: ["userId1", "userId2", "userId3"],
      chatName: "Group",
      latestMessage: "messageId1",
      updatedAt: new Date(),
    });

    sinon.stub(Chat, "findOne").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves({
          _id: "chatId1",
          users: ["userId1", "userId2", "userId3"],
          chatName: "Group",
          latestMessage: "messageId1",
          updatedAt: new Date(),
        }),
      }),
    });
    await creatGroupChat(req, res);
    expect(res.status.called).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });

  it("if chat is not created, return 404 status", async () => {
    req = mockReq({
      body: {
        name: "Group",
        users: ["userId1", "userId2", "userId3"],
      },
      user: {
        _id: "userId1",
        name: "User1",
        email: "user1@example.com",
        pic: "user1.jpg",
      },
    });

    sinon.stub(Chat, "create").resolves({
      _id: "chatId1",
      users: ["userId1", "userId2", "userId3"],
      chatName: "Group",
      latestMessage: "messageId1",
      updatedAt: new Date(),
    });

    sinon.stub(Chat, "findOne").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves(null),
      }),
    });
    await creatGroupChat(req, res);
    expect(res.status.called).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
  });
});

//---------------------------------Add user to group chat-------------------------
describe("add user to group chat", () => {
  let req, res, next;
  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return json data when user is added", async () => {
    req = mockReq({
      body: {
        userId: "userId1",
        chatId: "chatId1",
      },
    });
    const date = new Date();
    sinon.stub(Chat, "findByIdAndUpdate").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves({
          _id: "chatId1",
          users: ["userId1", "userId2", "userId3"],
          chatName: "Group",
          latestMessage: "messageId1",
          updatedAt: date,
        }),
      }),
    });
    let result = await addToGroup(req, res);
    // console.log();

    expect(res.json.calledOnce).to.be.true;
    // console.log(res.json.firstCall.args);
    expect([
      {
        _id: "chatId1",
        users: ["userId1", "userId2", "userId3"],
        chatName: "Group",
        latestMessage: "messageId1",
        updatedAt: date,
      },
    ]).to.deep.equal(res.json.firstCall.args);
  });

  it("should return 404 when chat is not found", async () => {
    req = mockReq({
      body: {
        userId: "userId1",
        chatId: "chatId1",
      },
    });
    sinon.stub(Chat, "findByIdAndUpdate").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves(null),
      }),
    });
    await addToGroup(req, res);
    expect(res.status.called).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
  });
});

//---------------------------------Remove user from group chat-------------------------

describe("Remove user from group chat", () => {
  let req, res, next;
  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = sinon.spy();
  });
  afterEach(() => {
    sinon.restore();
  });

  it("should return json data when user is removed", async () => {
    req = mockReq({
      body: {
        userId: "userId1",
        chatId: "chatId1",
      },
    });
    const date = new Date();
    sinon.stub(Chat, "findByIdAndUpdate").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves({
          _id: "chatId1",
          users: ["userId2", "userId3"],
          chatName: "Group",
          latestMessage: "messageId1",
          updatedAt: date,
        }),
      }),
    });
    let result = await removeFromGroup(req, res);
    // console.log();
    expect(res.json.calledOnce).to.be.true;
    // console.log(res.json.firstCall.args);
    expect([
      {
        _id: "chatId1",
        users: ["userId2", "userId3"],
        chatName: "Group",
        latestMessage: "messageId1",
        updatedAt: date,
      },
    ]).to.deep.equal(res.json.firstCall.args);
  });

  it("if length of users is less that 2, return msg", async () => {
    req = mockReq({
      body: {
        userId: "userId1",
        chatId: "chatId1",
      },
    });
    const date = new Date();
    sinon.stub(Chat, "findByIdAndUpdate").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves({
          _id: "chatId1",
          users: ["userId2"],
          chatName: "Group",
          latestMessage: "messageId1",
          updatedAt: date,
        }),
      }),
    });
    sinon.stub(Chat, "findByIdAndDelete").returns({
      populate: sinon.stub().returns({
        populate: sinon.stub().resolves({}),
      }),
    });
    await removeFromGroup(req, res);
    expect(res.json.calledOnce).to.be.true;
    expect([
      {
        message: "Group is now empty",
      },
    ]).to.deep.equal(res.json.firstCall.args);
  });
});

//---------------------------------Update group chat picture-------------------------

describe("Update group chat picture", () => {
  let req, res, next;
  beforeEach(() => {
    req = mockReq();
    res = mockRes();
    next = sinon.spy();
  });
  afterEach(() => {
    sinon.restore();
  });
  it("should return json data when user is added", async () => {
    req = mockReq({
      body: {
        userId: "userId1",
        pic: "user1.jpg",
      },
    });
    const date = new Date();
    sinon.stub(Chat, "findByIdAndUpdate").returns({
      populate: sinon.stub().resolves({
        _id: "chatId1",
        users: ["userId2", "userId3"],
        chatName: "Group",
        latestMessage: "messageId1",
        updatedAt: date,
        pic: "user1.jpg",
      }),
    });
    let result = await updatePic(req, res);
    // console.log();
    expect(res.json.calledOnce).to.be.true;
    expect([
      {
        _id: "chatId1",
        users: ["userId2", "userId3"],
        chatName: "Group",
        latestMessage: "messageId1",
        updatedAt: date,
        pic: "user1.jpg",
      },
    ]).to.deep.equal(res.json.firstCall.args);
  });

  it("should return 404 when chat is not found", async () => {
    req = mockReq({
      body: {
        userId: "userId1",
        pic: "user1.jpg",
      },
    });
    const date = new Date();
    sinon.stub(Chat, "findByIdAndUpdate").returns({
      populate: sinon.stub().resolves(null),
    });
    try {
      await updatePic(req, res);
    } catch (err) {
      expect(res.status.called).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(err.message).to.deep.equal("Chat Not Found");
    }
  });
});
