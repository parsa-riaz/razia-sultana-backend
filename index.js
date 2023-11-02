import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(
  cors({
    origin: "*",
  })
);
app.post("/users/contactus", async (req, res) => {
  try {
    let data = req.body.newform;
    console.log(data);
    let txt = `
    name:  ${data.name}
  
    email: ${data.email}
  
    message: ${data.message}
     `;
    let filename = data.filename;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: "587",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
      secureConnection: process.env.SECURE,
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });
    let mailOptions = {
      to: "raziasultanawelfare@gmail.com",
      subject: data.subject,
      text: txt,
      attachments: [{ filename, path: data.file }],
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        res.status(200).json({ message: "notsend" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "send" });
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
