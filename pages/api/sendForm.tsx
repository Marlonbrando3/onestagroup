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
    subject: `Kampania UK - EN: ${req.body.name}`,
    text: "Hello. This email is for your email verification.",
    html:
      `Ankieta:` +
      `<br><br>` +
      `Region: ${req.body.region}` +
      `<br>` +
      `Typ nieruchomości: ${req.body.type}` +
      `<br>` +
      `Planowana data zakupy: ${req.body.date}` +
      `<br>` +
      `Czy wchodzi w grę wyłączność?: ${req.body.exclusive}` +
      `<br>` +
      `Cena:${req.body.price}` +
      `<br><br>` +
      `Dane personalne` +
      `<br><br>` +
      `Imię i nazwisko: ${req.body.name}` +
      `<br>` +
      `Telefon: ${req.body.phone}` +
      `<br>` +
      `Email kontaktowy: ${req.body.email}` +
      `<br>` +
      `Telefon kontaktowy: ${req.body.phone}` +
      `<br><br>` +
      `Kraj: ${req.body.phone}` +
      `<br><br>`,
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
