const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const { protect } = require("../middleware/authMiddleware");

describe("protect middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 403 if no token is present", async () => {
    await protect(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(
      res.send.calledWith({
        success: false,
        message: "Bad Request",
      })
    ).to.be.true;
  });

  it("should return 403 if token is invalid", async () => {
    req.cookies.access_token = "invalidToken";
    sinon.stub(jwt, "verify").returns(null);

    await protect(req, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(
      res.send.calledWith({
        success: false,
        message: "Bad Request",
      })
    ).to.be.true;
    jwt.verify.restore();
  });

  it("should generate error if error occurs while sending user details", async () => {
    req.cookies.access_token = "validToken";

    const user = {
      _id: "userId1",
      name: "User1",
      email: "user1@example.com",
      pic: "user1.jpg",
    };
    sinon.stub(jwt, "verify").returns({ id: user._id });
    sinon.stub(User, "findById").resolves(user);

    await protect(req, res, next);

    // expect(next.calledOnce).to.be.true;
    // expect(req.user).to.deep.equal(user);
    expect(res.status.called).to.be.true;
    expect(res.send.called).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;

    jwt.verify.restore();
    User.findById.restore();
  });

  it("should call next if a valid token and user details are sent properly", async () => {
    req.cookies.access_token = "validToken";

    const user = {
      _id: "userId1",
      name: "User1",
      email: "user1@example.com",
      pic: "user1.jpg",
    };
    sinon.stub(jwt, "verify").returns({ id: user._id });
    sinon.stub(User, "findById").returns({
      select: sinon.stub().resolves(user),
    });

    await protect(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(req.user).to.deep.equal(user);

    jwt.verify.restore();
    User.findById.restore();
  });
});
