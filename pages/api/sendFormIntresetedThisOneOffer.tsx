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
    to: endEmail,
    subject: `Zainteresowanie daną ofertą: ${req.body.OfferNumber}`,
    text: "Hello. This email is for your email verification.",
    html:
      `Zainteresowany ofertą nr ${req.body.offer}:` +
      `<br><br>` +
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
