const { expect } = require("chai");
const sinon = require("sinon");
const User = require("../models/userModel");

const { allUsers, logout } = require("../controllers/userController");

describe("userController", () => {
  describe("allUsers", () => {
    it("should return all users matching search query", async () => {
      const req = {
        body: {
          q: "test query",
        },
      };
      const res = {
        json: sinon.spy(),
      };

      sinon
        .stub(User, "aggregate")
        .resolves([{ name: "User 1" }, { name: "User 2" }]);

      await allUsers(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal([
        { name: "User 1" },
        { name: "User 2" },
      ]);

      User.aggregate.restore();
    });

    it("should generate error if no query is provided", async () => {
      const req = {
        body: {},
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      try {
        await allUsers(req, res);
      } catch (error) {
        expect(error.message).to.equal("No query provided");
      }
    });
  });

  describe("logout", () => {
    it("should clear cookie and redirect", () => {
      const req = {};
      const res = {
        clearCookie: sinon.spy(),
        redirect: sinon.spy(),
      };

      logout(req, res);

      expect(res.clearCookie.calledOnce).to.be.true;
      expect(res.clearCookie.calledWith("access_token")).to.be.true;
      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith("/")).to.be.true;
    });
  });
});
