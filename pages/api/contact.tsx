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
    subject: `Wiadomość ze strony od: ${req.body.Name}`,
    text: "Hello. This email is for your email verification.",
    html:
      `Dotyczy: ${req.body.Id}` +
      `<br>` +
      `Email kontaktowy: ${req.body.Email}` +
      `<br>` +
      `Telefon kontaktowy: ${req.body.Phone}` +
      `<br><br>` +
      `Wiadomość ${req.body.Message}` +
      `<br>`,
  };

  async function send() {
    await transporter.sendMail(mailData, function (err: any, info: any) {
      console.log("wysłane");
      if (err) console.log(err);
      else console.log(info);
    });
    res.status(200);
  }

  send();
}
