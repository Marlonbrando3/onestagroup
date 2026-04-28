import type { NextApiRequest, NextApiResponse } from "next";
import { sendMail, LEADS_RECIPIENT } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, phone, msg, offer } = req.body ?? {};

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
  }

  try {
    await sendMail({
      to: LEADS_RECIPIENT,
      subject: `Facebook Ankieta www: ${name}`,
      html: `
        Kontakt przed uzupełnieniem ankiety:<br><br>
        Klient wybrał ofertę nr: ${offer ?? "-"}<br><br>
        Dane personalne:<br><br>
        Imię i nazwisko: ${name}<br>
        Email: ${email ?? "-"}<br>
        Telefon: ${phone}<br><br>
        Wiadomość: ${msg ?? "-"}
      `,
    });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: "MAIL_SEND_FAILED" });
  }
}
