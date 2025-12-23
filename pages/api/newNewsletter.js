export default function (req, res) {
  // require("dotenv").config();
  let nodemailer = require("nodemailer");

  const endEmail = "biuro@onesta.com.pl";
  const fromEmail = process.env.FROM_EMAIL;
  const pass = process.env.EMAIL_PASS;

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "mail-serwer141299.lh.pl",
    secure: true,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      // type: "OAuth2",
      user: fromEmail,
      pass: pass,
    },
  });

  const mailData = {
    from: fromEmail,
    to: "marek.marszalek@onesta.com.pl",
    subject: `Zapis do newslettera`,
    text: "Zapis do newslettera",
    html:
      `Imię i nazwisko: ${req.body.name}` + `<br>` + `Email kontaktowy: ${req.body.email}` + `<br>`,
  };

  transporter.sendMail(mailData, function (err, info) {
    console.log("wysyłam");
    if (err) {
      console.log(err);
      res.status(400).json({ status: 400 });
    } else {
      console.log(info);
      res.status(200).json({ status: 200 });
    }
  });
}
