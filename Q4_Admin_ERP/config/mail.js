import dotenv from "dotenv";
dotenv.config();

console.log("EMAIL:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS); // should print 16-char string

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email login failed:", error);
  } else {
    console.log("✅ Server is ready to send emails");
  }
});

export default transporter;
