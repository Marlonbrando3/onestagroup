export default async function (req: any, res: any) {
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
    subject: `Zamówienie konsultacji`,
    text: "Hello. This email is for your email verification.",
    html:
      `Imię : ${req.body.name}` +
      `<br><br>` +
      `<br>` +
      `Telefon kontaktowy: ${req.body.phone}` +
      `<br>` +
      `Mail: ${req.body.email}` +
      `<br>` +
      `Wiadomość: ${req.body.msg}` +
      `<br><br>`,
  };

  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err: any, info: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });

    return res.status(200).json({ msg: "sended", status: 200 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "MAIL_SEND_FAILED", status: 500 });
  }
}
