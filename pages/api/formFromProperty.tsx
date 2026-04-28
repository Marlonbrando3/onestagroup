import type { NextApiRequest, NextApiResponse } from "next";
import { sendMail, RECIPIENT } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, phone, mail, massege, ref, id } = req.body ?? {};

  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
  }

  try {
    await sendMail({
      to: RECIPIENT,
      subject: `Zainteresowanie nieruchomością: ${id ?? ref ?? "-"}`,
      html: `
        Imię: ${name}<br>
        Telefon: ${phone}<br>
        Email: ${mail ?? "-"}<br><br>
        Wiadomość: ${massege ?? "-"}<br><br>
        Ogłoszenie nr: ${ref ?? id ?? "-"}
      `,
    });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: "MAIL_SEND_FAILED" });
  }
}
