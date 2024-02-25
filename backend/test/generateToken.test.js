const { expect } = require("chai");
const sinon = require("sinon");

const generateToken = require("../generateToken");

describe("generateToken", () => {
  it("should generate a valid JWT token with user id", () => {
    const id = "1234";
    const token = generateToken(id);

    expect(token).to.be.a("string");
    expect(token.split(".")).to.have.lengthOf(3);
  });

  it("should throw error if id not provided", () => {
    expect(() => generateToken()).to.throw("id is required");
  });
});
