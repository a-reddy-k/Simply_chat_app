const chai = require("chai");
const expect = chai.expect;

const sendMail = require("../controllers/nodeMailerController");

describe("Test sendMail", () => {
  describe("send mail on valid mail-id", () => {
    let email = "sample@gmail.com";
    let subject = "sample sunject";
    let html = "<p>Sample html</p>";
    it("mail should be sent", async () => {
      const actualResult = await sendMail(subject, email, html);
      console.log(actualResult);
      expect(actualResult).to.be.a("string").and.to.have.lengthOf(4);
    }).timeout(5000);
  });

  describe("throw error on invalid email", () => {
    it("On error the function catches and returns not ok", async () => {
      expect(() => {
        sendMail();
      }).to.throw();
    });
  });
});
