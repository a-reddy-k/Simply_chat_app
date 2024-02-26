const nodemailer = require("nodemailer");
require("dotenv").config();

function sendMail(sub, email, text) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: sub,
    html: text,
  };
  console.log(mailOptions);
  // Create a nodemailer transporter
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendMail;
