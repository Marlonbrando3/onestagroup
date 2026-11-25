import type { NextApiRequest, NextApiResponse } from "next";
import { normalizeNotificationSettings } from "@/components/crm/notificationSettings";
import { getCrmUser } from "@/components/crm/users";
import { requireCrmUser } from "@/lib/crmServerAuth";
import { getCrmUserSettings } from "@/lib/crmUserSettings";
import { supabaseServer } from "@/lib/supabaseClient";

// Ustawienia konta CRM zalogowanej osoby (powiadomienia push).
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;

  if (req.method === "GET") {
    return res.status(200).json({
      user: { email: user.email, name: getCrmUser(user.email)?.label || user.email, isAdmin: user.isAdmin },
      settings: await getCrmUserSettings(user.email),
    });
  }

  if (req.method === "PUT") {
    const settings = normalizeNotificationSettings(req.body?.settings);
    const { error } = await supabaseServer
      .from("crm_user_settings")
      .upsert({ user_email: user.email, settings, updated_at: new Date().toISOString() });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ settings });
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ error: "Method not allowed" });
}
