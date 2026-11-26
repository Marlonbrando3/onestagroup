import type { NextApiRequest, NextApiResponse } from "next";
import { requireCrmSuperadmin } from "@/lib/crmServerAuth";
import { listChatPresentations, readChatConfig, saveChatConfig } from "@/lib/leadManager/chat";
import { addLmLog } from "@/lib/leadManager/settings";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const user = await requireCrmSuperadmin(req, res);
  if (!user) return;
  try {
    if (req.method === "GET") {
      const [config, presentations] = await Promise.all([readChatConfig(), listChatPresentations()]);
      return res.status(200).json({ config, presentations });
    }
    if (req.method === "PUT") {
      const config = await saveChatConfig(req.body?.config);
      await addLmLog("info", "Zapisano czat ofertowy", `Zmienił(a): ${user.email}`);
      return res.status(200).json({ config });
    }
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Błąd konfiguracji czatu." });
  }
}
