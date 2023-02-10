const _ = require("lodash");
require("dotenv").config();


//------------------------------------------------------------------- NODE AREA

// Exercise #01

const nodemailer = require("nodemailer");

// A .env file in root directory of project is needed, plus adding these 3 lines :
//
// SMTP_SERVICE=gmail
// SMTP_EMAIL=*Your Email*
// SMTP_PASSWORD=*Your App password after activating 2-step verification*
//
// For google app password : https://miracleio.me/snippets/use-gmail-with-nodemailer/#:~:text=your%20Gmail%20account.-,Enable%202%2DStep%20Verification,-To%20generate%20app

const from = process.env.SMTP_EMAIL,
  to = "Your Reciever's Email",
  subject = "Your Subject",
  text = "Your Text",
  attachments = [
    {
      filename: "user-data.json",
      path: "./files/user-data.json",
    },
  ];

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const mailOptions = {
  from: from,
  to: to,
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

const input = "./files/dummy-word.docx";
const output = "./export/dummy-word.pdf";

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

    const OUTPUT = "./export/user-data.xlsx";

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

// Exercise #04

const sharp = require("sharp");

const DIR = "./files/test-image.png";
const OUTPUT = "./export/test-image.jpg";

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

//------------------------------------------------------------------- PROMISE AREA

// Exercise #03

const fs = require("fs");
const { env } = require("process");

const createFiles = () => {
  return new Promise((resolve, reject) => {
    const namesData = {
      dir: "./files/names.txt",
      text: "0001 - Mohammad\n0002 - Ali\n0003 - Zahra",
    };
    const numbersData = {
      dir: "./files/numbers.txt",
      text: "0001 - 09111111\n0002 - 09222222\n0002 - 09333333",
    };

    fs.promises
      .writeFile(namesData.dir, namesData.text)
      .then(() => {
        console.log("The names file has been saved!");
        return fs.promises.writeFile(numbersData.dir, numbersData.text);
      })
      .then(() => {
        console.log("The numbers file has been saved!");
        resolve();
      })
      .catch((err) => {
        console.error(err);
        reject();
      });
  });
};

const buildResult = () => {
  return new Promise((resolve, reject) => {
    const DIR = {
      names: "./files/names.txt",
      numbers: "./files/numbers.txt",
    };
    const OUTPUT = "./export/result.txt";

    fs.readFile(DIR.names, "utf8", (err, namesData) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        fs.readFile(DIR.numbers, "utf8", (err, numbersData) => {
          if (err) {
            console.log(err);
          } else {
            const namesLines = namesData.split("\n");
            const numbersLines = numbersData.split("\n");

            const names = namesLines
              .map((line) => {
                let parts = line.split(" - ");
                return { id: parts[0], name: parts[1] };
              })
              .sort((a, b) => {
                let x = a.id;
                let y = b.id;
                return x > y ? 1 : y > x ? -1 : 0;
              });

            const numbers = numbersLines.map((line) => {
              let parts = line.split(" - ");
              return { id: parts[0], number: parts[1] };
            });

            let numbersByID = {};
            numbers.forEach((number) => {
              if (!numbersByID[number.id]) {
                numbersByID[number.id] = [];
              }
              numbersByID[number.id].push(number.number);
            });

            let results = names.map((name) => {
              let numbers = numbersByID[name.id];
              if (numbers && numbers.length > 0) {
                if (numbers.length === 1) {
                  return `${name.name}'s phone number is ${numbers[0]}`;
                } else {
                  return `${name.name}'s phone numbers are ${numbers.join(
                    ", "
                  )}`;
                }
              } else {
                return `${name.name} hasn't any phone number.`;
              }
            });

            fs.writeFile(OUTPUT, results.join("\n"), "utf8", (err) => {
              if (err) {
                console.log(err);
                reject();
              } else {
                console.log("The file has been saved!");
                resolve();
              }
            });
          }
        });
      }
    });
  });
};

const runProcess = async () => {
  try {
    await createFiles();
    await buildResult();
  } catch (err) {
    console.log(err);
  }
};

// runProcess();

//-------------------------------------------------------------------
