import type { NextApiRequest, NextApiResponse } from "next";
import { completeChat, recordChatOpen } from "@/lib/leadManager/chat";

// Publiczne API czatu ofertowego (/czat/<token>)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const token = String(req.body?.token || "").slice(0, 2048);
  const action = String(req.body?.action || "");
  try {
    if (action === "open") {
      await recordChatOpen(token);
      return res.status(200).json({ ok: true });
    }
    if (action === "complete") {
      const answers = Array.isArray(req.body?.answers) ? req.body.answers.map((item: unknown) => String(item).slice(0, 40)) : [];
      const result = await completeChat(token, answers);
      return res.status(200).json({ ok: true, ...result });
    }
    return res.status(400).json({ error: "Nieznana akcja." });
  } catch (error) {
    console.error("czat ofertowy:", error);
    return res.status(400).json({ error: error instanceof Error ? error.message : "Coś poszło nie tak." });
  }
}
