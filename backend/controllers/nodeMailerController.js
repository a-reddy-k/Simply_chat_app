const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function isValidEmail(email) {
  // Regular expression for a simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sendMail(subject, email, htmlMessage) {
  // console.log("here");

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: htmlMessage,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Email sent:", info.response);
        // return info.response;
        resolve("sent");
      }
    });
  });
}

module.exports = sendMail;
