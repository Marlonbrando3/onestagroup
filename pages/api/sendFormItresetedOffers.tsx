import type { NextApiRequest, NextApiResponse } from "next";
import { sendMail, RECIPIENT } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, phone, msg, OfferNumber } = req.body ?? {};

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
  }

  try {
    await sendMail({
      to: RECIPIENT,
      subject: `Zainteresowanie ofertą: ${OfferNumber ?? "-"}`,
      html: `
        Zainteresowany ofertą nr ${OfferNumber ?? "-"}:<br><br>
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
