export default function (req: any, res: any) {
  let nodemailer = require("nodemailer");

  const endEmail = "leady@onesta.com.pl";
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

  const clientMailData = {
    from: "Onesta Group <www@onesta.com.pl>",
    to: req.body.email,
    subject: `Onesta Group || Nieruchomości w Hiszpanii`,
    text: "Hello. This email is for your email verification.",
    html:
      `Dzień dobry,` +
      `<br><br>` +
      `Dziękujemy za zainteresowanie naszymi ofertami nieruchomości.<br>
      Przesyłamy Państwu link do wybranej wcześniej inwestycji, niemniej dostępne są tam również inne TOP-owe i rekomendowane inwestycje o podobnym charakterze.
      <br><br>
      <a href=https://onesta.com.pl/choosedoffers?offer=${req.body.offer}&id=Galeria>Kliknij tutaj aby przejść do szczegółów nt. wybranej nieruchomości</a><br><br> 
      Mamy nadzieję, że kilka z nich przypadnie Państwu do gustu. <br> 
      Jeśli jednak potrzebujecie Państwo więcej ogłoszeń, zapraszamy na naszą stronę internetową <a href=https://onesta.com.pl/hiszpania?page=1>(klikając tutaj)</a> na której jest ich blisko 200.
      <br><br>
      Zapraszamy również do kontaktu telefonicznego lub mailowego
      <br>
      Marek  <a href=tel:+48576652525>+48 576 65 25 25</a><br>
      Karolina <a href=tel:+48505055846>+48 505 055 846</a>
      <br><br>
      Pozdrawiamy!<br>
      Zespół Onesta Group || Nieruchomości w Hiszpanii
      `,
  };

  const mailData = {
    from: fromEmail,
    to: endEmail,
    subject: `Formularz FB - WWW po ankiecie ${req.body.name}`,
    text: "Hello. This email is for your email verification.",
    html: `<strong>Zainteresowany ofertą nr: </strong> ${req.body.offer}:
      <br><br>
      <strong>Dane personalne: </strong>
      <br><br>
      Imię i nazwisko: ${req.body.name}
      <br>
      Email kontaktowy: ${req.body.email}
      <br>
      Telefon kontaktowy: ${req.body.phone}
      <br><br>
      Wiadomość: ${req.body.msg}
      <br><br>
      <strong>PREFERENCJE: </strong>
      <br>
      <strong>Region: </strong>${req.body.region},
      <br>
      <strong>Typy nieruchomości: </strong>${req.body.type},
      <br>
      <strong>Planowa Data zakupu: </strong>${req.body.time}
      <br>
      <strong>Zakładany budżet: </strong>${req.body.price}`,
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

  new Promise((resolve, reject) => {
    transporter.sendMail(clientMailData, (err: any, info: any) => {
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
