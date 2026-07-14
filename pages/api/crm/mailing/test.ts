import type { NextApiRequest, NextApiResponse } from "next";
import {
  getMailingSender,
  normalizeMailingContent,
  renderMailingHtml,
  requireCrmAdmin,
  resendJson,
} from "@/lib/crmMailingServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireCrmAdmin(req, res);
  if (!admin) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const subject = String(req.body?.subject || "Test mailingu Onesta").trim();
  const content = normalizeMailingContent(req.body?.content);
  const previewText = String(req.body?.previewText || "").trim();
  try {
    const sender = getMailingSender();
    const html = renderMailingHtml(content, previewText)
      .replaceAll("{{{contact.first_name|tam}}}", "Marek")
      .replaceAll("{{{RESEND_UNSUBSCRIBE_URL}}}", "https://onesta.com.pl");
    const result = await resendJson<{ id: string }>("/emails", {
      method: "POST",
      body: JSON.stringify({
        from: sender.formatted,
        to: [admin.email],
        reply_to: String(process.env.MAILING_REPLY_TO || sender.email),
        subject: `[TEST] ${subject}`,
        html,
      }),
    });
    return res.status(200).json({ sent: true, id: result.id, to: admin.email });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Nie udało się wysłać testu." });
  }
}

