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
    subject: `Jestem zainteresowany nieruchomością ${req.body.id}`,
    text: "Hello. This email is for your email verification.",
    html:
      `Imię : ${req.body.name}` +
      `<br>` +
      `Telefon kontaktowy: ${req.body.phone}` +
      `<br><br>` +
      `Wiadomość: ${req.body.massege}` +
      `<br><br>`,
  };

  async function send() {
    await transporter.sendMail(mailData, function (err: any, info: any) {
      console.log("wysłane");
      if (err) {
        console.log(err);
        res.json({ msg: err, status: 400 }).status(400);
      } else {
        console.log(info);
        res.json({ msg: "sended", status: 200 }).status(200);
      }
    });
  }

  send();
}
