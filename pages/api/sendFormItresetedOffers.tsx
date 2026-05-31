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
    subject: `Zainteresowanie daną ofertą: ${req.body.OfferNumber}`,
    text: "Hello. This email is for your email verification.",
    html:
      `Zainteresowany ofertą nr ${req.body.OfferNumber}:` +
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

  try {
    await transporter.sendMail(mailData);
    return res.status(200).json({ status: 200 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500 });
  }
}
