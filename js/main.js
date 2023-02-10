const _ = require("lodash");

//-------------------------------------------------------------------

// Exercise #01

const nodemailer = require("nodemailer");
const SD = require("../sensitive-data");

const subject = "Another subject from nodemailer";
const text = "Another one with attachment!";
const attachments = [
  {
    filename: "user-data.json",
    path: "../files/user-data.json",
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

// Exercise #02

const docx_pdf = require("docx-pdf");

const input = "../files/dummy-word.docx";
const output = "../export/dummy-word.pdf";

const convertToPDF = () => {
  docx_pdf(input, output, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Result: ", result);
    }
  });
};

// convertToPDF();

//-------------------------------------------------------------------

// Exercise #03

const axios = require("axios");
const Excel = require("exceljs");

const getData = () => {
  return new Promise((resolve, reject) => {
    const method = "get";
    const url = "https://reqres.in/api/users?page=1";
    const headers = { "Content-Type": "application/json" };

    axios({
      method: method,
      url: url,
      headers: headers,
    })
      .then(({ data }) => {
        resolve(data.data);
      })
      .catch((err) => {
        reject(console.log(err));
      });
  });
};

const createWorksheet = (data) => {
  let columns = [];
  _.keys(data[0]).forEach((c) => columns.push({ header: c, key: c }));

  return new Promise((resolve, reject) => {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet("Sheet #1");

    const OUTPUT = "../export/user-data.xlsx";

    worksheet.columns = columns;

    data.forEach((r) => {
      worksheet.addRow(r);
    });

    const maxLengths = [];
    worksheet.eachRow((row) => {
      row.eachCell((cell, colNumber) => {
        const columnIndex = cell.col - 1;
        if (colNumber === 1) {
          cell.alignment = { horizontal: "left" };
        }
        if (
          !maxLengths[columnIndex] ||
          cell.value.toString().length > maxLengths[columnIndex]
        ) {
          maxLengths[columnIndex] = cell.value.toString().length;
        }
      });
    });

    maxLengths.forEach((maxLength, index) => {
      worksheet.getColumn(index + 1).width = maxLength;
    });

    workbook.xlsx.writeFile(OUTPUT).then(function () {
      console.log("File written successfully");
    });
  });
};

const buildXLSX = async () => {
  try {
    const userData = await getData();
    await createWorksheet(userData);
  } catch (error) {
    console.log(error);
  }
};

// buildXLSX();

//-------------------------------------------------------------------

// Exercise 04

const sharp = require("sharp");

const DIR = "../files/test-image.png";
const OUTPUT = "../export/test-image.jpg";

const convertImage = () => {
  sharp(DIR)
    .resize(500, 500)
    .jpeg({ quality: 90 })
    .toFile(OUTPUT, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Image conversion successfull!/nResult: ", info);
      }
    });
};

// convertImage();

//-------------------------------------------------------------------
