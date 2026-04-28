import type { NextApiRequest, NextApiResponse } from "next";
import { sendMail, RECIPIENT } from "@/lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { dataForm, Ref } = req.body ?? {};

  if (!dataForm?.Name || !dataForm?.Email) {
    return res.status(400).json({ ok: false, error: "MISSING_FIELDS" });
  }

  try {
    await sendMail({
      to: RECIPIENT,
      subject: `Wiadomość ze strony od: ${dataForm.Name}`,
      html: `
        Dotyczy: ${Ref ?? "-"}<br>
        Email: ${dataForm.Email}<br>
        Telefon: ${dataForm.Phone ?? "-"}<br><br>
        Wiadomość: ${dataForm.Message ?? "-"}
      `,
    });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: "MAIL_SEND_FAILED" });
  }
}
