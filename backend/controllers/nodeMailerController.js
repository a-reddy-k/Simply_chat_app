const nodemailer = require("nodemailer");
require("dotenv").config();

function sendMail(email, text, sub) {
  const mailOptions = {
    from: process.env.Email,
    to: email,
    subject: sub,
    html: text,
  };
  console.log(mailOptions);
  // Create a nodemailer transporter
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email,
      pass: process.env.Password,
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
