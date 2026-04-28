import type { NextApiRequest, NextApiResponse } from "next";
import { sendMail, RECIPIENT } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { Name, Phone } = req.body ?? {};

  if (!Name || !Phone) {
    return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
  }

  try {
    await sendMail({
      to: RECIPIENT,
      subject: `Szybki kontakt ze strony od: ${Name}`,
      html: `
        Szybki kontakt z "O Nas"<br>
        Imię i nazwisko: ${Name}<br>
        Telefon: ${Phone}
      `,
    });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: "MAIL_SEND_FAILED" });
  }
}
