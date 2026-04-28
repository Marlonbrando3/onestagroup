import type { NextApiRequest, NextApiResponse } from "next";
import { sendMail, RECIPIENT } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, phone, region, type, date, exclusive, price, country } =
    req.body ?? {};

  if (!name || !email || !phone) {
    return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
  }

  try {
    await sendMail({
      to: RECIPIENT,
      subject: `Ankieta od: ${name}`,
      html: `
        Ankieta:<br><br>
        Region: ${region ?? "-"}<br>
        Typ nieruchomości: ${type ?? "-"}<br>
        Planowana data zakupu: ${date ?? "-"}<br>
        Wyłączność: ${exclusive ?? "-"}<br>
        Cena: ${price ?? "-"}<br><br>
        Dane personalne:<br><br>
        Imię i nazwisko: ${name}<br>
        Telefon: ${phone}<br>
        Email: ${email}<br>
        Kraj: ${country ?? "-"}
      `,
    });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: "MAIL_SEND_FAILED" });
  }
}
