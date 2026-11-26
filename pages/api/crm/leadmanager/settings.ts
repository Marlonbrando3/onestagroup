import type { NextApiRequest, NextApiResponse } from "next";
import { requireCrmSuperadmin } from "@/lib/crmServerAuth";
import { addLmLog, publicLmSettings, readLmSettings, saveLmSettings } from "@/lib/leadManager/settings";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const user = await requireCrmSuperadmin(req, res);
  if (!user) return;
  try {
    if (req.method === "GET") {
      // Podgląd pełnej wartości tokenu – tylko na żądanie (przycisk „Pokaż”), zapisywany w dzienniku
      const reveal = String(req.query.reveal || "");
      if (reveal) {
        const settings = await readLmSettings();
        const values: Record<string, string> = {
          appSecret: settings.meta.appSecret,
          pageAccessToken: settings.meta.pageAccessToken,
          apiToken: settings.sms.apiToken,
        };
        if (!(reveal in values)) return res.status(400).json({ error: "Nieznane pole." });
        const labels: Record<string, string> = { appSecret: "App Secret", pageAccessToken: "Page Access Token", apiToken: "token SMSAPI" };
        await addLmLog("info", `Podgląd: ${labels[reveal]}`, `Wyświetlił(a): ${user.email}`);
        return res.status(200).json({ value: values[reveal] });
      }
      return res.status(200).json({ settings: publicLmSettings(await readLmSettings()) });
    }
    if (req.method === "PUT") {
      const saved = await saveLmSettings(req.body);
      await addLmLog("info", "Zapisano konfigurację", `Zmienił(a): ${user.email}`);
      return res.status(200).json({ settings: publicLmSettings(saved) });
    }
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Błąd konfiguracji." });
  }
}
