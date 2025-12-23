import { NextResponse, NextRequest } from "next/server";
let nodemailer = require("nodemailer");

export async function POST(request: Request) {
  const data = await request.json();

  const endEmail = "marek.marszalek@onesta.com.pl";
  const fromEmail = process.env.FROM_EMAIL;
  const pass = process.env.EMAIL_PASS;

  console.log("Odebrałem dane");

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
    subject: `Nowy FB Lead: ${data.name}`,
    text: "Hello. This email is for your email verification.",
    html: "działa",
    //   `Imię i nazwisko: ${req.body.name} ${req.body.lastName}` +
    //   `<br>` +
    //   `Email kontaktowy: ${req.body.email}` +
    //   `<br>` +
    //   `Telefon kontaktowy: ${req.body.phone}` +
    //   `<br>` +
    //   `Czy wysłać oferty? ${req.body.examples}` +
    //   `<br>` +
    //   `Termin przylotu: ${req.body.date}` +
    //   `<br><br>` +
    //   `Wiadomość: ${req.body.massege}` +
    //   `<br>`,
  };

  new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err: any, info: any) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });

  return NextResponse.json({ message: "Dane zostały odebrane" });
}
