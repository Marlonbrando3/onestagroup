export default function (req, res) {
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

  async function send() {
    await transporter.sendMail(mailData, function (err, info) {
      console.log("wysłane");
      if (err) console.log(err);
      else console.log(info);
    });
    res.status(200).json({ msg: 200 });
  }

  send();
}
