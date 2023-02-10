//-------------------------------------------------------------------

// Exercise #01

const nodemailer = require("nodemailer");
const SD = require("../sensitive-data");

const subject = "Another subject from nodemailer";
const text = "Another one with attachment!";
const attachments = [
  {
    filename: "user-data.json",
    path: "../user-data.json",
  },
];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SD.email,
    pass: SD.password,
  },
});

const mailOptions = {
  from: SD.email,
  to: SD.email,
  subject: subject,
  text: text,
  attachments: attachments,
};

const verifyTrasporter = () => {
  transporter.verify((error) => {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Server is ready to take our messages");
      return true;
    }
  });
};

const sendMail = () => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// verifyTrasporter();
// sendMail();

//-------------------------------------------------------------------