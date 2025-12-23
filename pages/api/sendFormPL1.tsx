export default function (req: any, res: any) {
  let nodemailer = require("nodemailer");

  const endEmail = "leady@onesta.com.pl";
  const fromEmail = process.env.FROM_EMAIL;
  const pass = process.env.EMAIL_PASS;

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "mail-serwer141299.lh.pl",
    secure: true,
    // tls: {
    //   ciphers: "SSLv3",
    // },
    auth: {
      // type: "OAuth2",
      user: fromEmail,
      pass: pass,
    },
  });

  const mailData = {
    from: "Onesta Group <www@onesta.com.pl>",
    to: endEmail,
    subject: `Facebook Ankieta www: ${req.body.name}`,
    text: "Hello. This email is for your email verification.",
    html:
      `Kontakt przed uzupełnieniem ankiety:` +
      `<br><br>` +
      `Klient wybrał ofertę nr : ${req.body.offer}` +
      `<br>` +
      `Dane personalne` +
      `<br><br>` +
      `Imię i nazwisko: ${req.body.name}` +
      `<br>` +
      `Email kontaktowy: ${req.body.email}` +
      `<br>` +
      `Telefon kontaktowy: ${req.body.phone}` +
      `<br><br>` +
      `Wiadomość: ${req.body.msg}` +
      `<br><br>`,
  };

  new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err: any, info: any) => {
      if (err) {
        console.error(err);
        reject(err);
        res.json({ status: 400 });
      } else {
        resolve(info);
        res.json({ status: 200 });
      }
    });
  });
}
