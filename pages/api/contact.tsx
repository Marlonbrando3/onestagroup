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
    subject: `Wiadomość ze strony od: ${req.body.dataForm.Name}`,
    text: "Hello. This email is for your email verification.",
    html:
      `Dotyczy: ${req.body.Ref}` +
      `<br>` +
      `Email kontaktowy: ${req.body.dataForm.Email}` +
      `<br>` +
      `Telefon kontaktowy: ${req.body.dataForm.Phone}` +
      `<br><br>` +
      `Wiadomość ${req.body.dataForm.Message}` +
      `<br>`,
  };

  async function send() {
    await transporter.sendMail(mailData, function (err: any, info: any) {
      console.log("wysłane");
      if (err) console.log(err);
      else console.log(info);
    });
    return res.status(200).json({ ok: true });
  }

  send();
}
