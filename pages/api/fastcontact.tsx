export default function (req: any, res: any) {
  let nodemailer = require("nodemailer");

  const endEmail = "marek.marszalek@onesta.com.pl";
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
    subject: `Wiadomość ze strony od: ${req.body.Name}`,
    text: "Hello. This email is for your email verification.",
    html:
      `Szybki kontakt z "O Nas"` +
      `<br>` +
      `Imię i nazwisko ${req.body.Name}` +
      `<br>` +
      `Telefon : ${req.body.Phone}` +
      `<br>`,
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
