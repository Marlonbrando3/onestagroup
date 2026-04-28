import type { NextApiRequest, NextApiResponse } from "next";
import { sendMail, LEADS_RECIPIENT } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, phone, msg, offer, region, type, time, price } =
    req.body ?? {};

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
  }

  try {
    await Promise.all([
      sendMail({
        to: LEADS_RECIPIENT,
        subject: `Formularz FB - WWW po ankiecie: ${name}`,
        html: `
          <strong>Zainteresowany ofertą nr:</strong> ${offer ?? "-"}<br><br>
          <strong>Dane personalne:</strong><br><br>
          Imię i nazwisko: ${name}<br>
          Email: ${email ?? "-"}<br>
          Telefon: ${phone}<br><br>
          Wiadomość: ${msg ?? "-"}<br><br>
          <strong>Preferencje:</strong><br>
          Region: ${region ?? "-"}<br>
          Typ nieruchomości: ${type ?? "-"}<br>
          Planowana data zakupu: ${time ?? "-"}<br>
          Budżet: ${price ?? "-"}
        `,
      }),
      email
        ? sendMail({
            to: email,
            subject: "Onesta Group || Nieruchomości w Hiszpanii",
            html: `
              Dzień dobry,<br><br>
              Dziękujemy za zainteresowanie naszymi ofertami nieruchomości.<br>
              Przesyłamy link do wybranej inwestycji oraz innych rekomendowanych nieruchomości.<br><br>
              <a href="https://onesta.com.pl/choosedoffers?offer=${offer ?? ""}&id=Galeria">
                Kliknij tutaj aby przejść do szczegółów wybranej nieruchomości
              </a><br><br>
              Zapraszamy również do kontaktu:<br>
              Marek <a href="tel:+48576652525">+48 576 65 25 25</a><br>
              Karolina <a href="tel:+48505055846">+48 505 055 846</a><br><br>
              Pozdrawiamy!<br>
              Zespół Onesta Group
            `,
          })
        : Promise.resolve(),
    ]);

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: "MAIL_SEND_FAILED" });
  }
}
