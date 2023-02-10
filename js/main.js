const nodemailer = require("nodemailer");

const SD = require("../sensitive-data");

const transporter = nodemailer.createTransport({
  host: "www.",
  port: 587,
  secure: false,
  auth: {
    user: SD.email,
    pass: SD.password,
  },
});
