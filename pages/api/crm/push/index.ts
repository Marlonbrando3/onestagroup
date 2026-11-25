import type { NextApiRequest, NextApiResponse } from "next";
import { isPushConfigured, isPushEnabledFor, sendCrmPush } from "@/lib/crmPush";
import { requireCrmUser } from "@/lib/crmServerAuth";
import { supabaseServer } from "@/lib/supabaseClient";

// Zapis / usunięcie telefonu do powiadomień push oraz powiadomienie testowe.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;

  if (req.method === "GET") {
    const { count } = await supabaseServer
      .from("crm_push_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("user_email", user.email);
    return res.status(200).json({
      enabledForUser: isPushEnabledFor(user.email),
      configured: isPushConfigured(),
      devices: count || 0,
    });
  }

  if (!isPushEnabledFor(user.email)) {
    return res.status(403).json({ error: "Powiadomienia są jeszcze w testach." });
  }

  if (req.method === "POST" && req.body?.action === "test") {
    const sent = await sendCrmPush(user.email, {
      title: "Onesta CRM 🔔",
      body: "Działa! Tak będą wyglądać powiadomienia o klientach i zadaniach.",
      url: "/crm",
      tag: "test",
    });
    return res.status(200).json({ sent });
  }

  if (req.method === "POST") {
    const subscription = req.body?.subscription;
    const endpoint = String(subscription?.endpoint || "");
    const p256dh = String(subscription?.keys?.p256dh || "");
    const auth = String(subscription?.keys?.auth || "");
    if (!endpoint.startsWith("https://") || !p256dh || !auth) {
      return res.status(400).json({ error: "Nieprawidłowe dane powiadomień." });
    }
    const { error } = await supabaseServer.from("crm_push_subscriptions").upsert(
      {
        user_email: user.email,
        endpoint,
        p256dh,
        auth,
        user_agent: String(req.headers["user-agent"] || "").slice(0, 300),
      },
      { onConflict: "endpoint" },
    );
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const endpoint = String(req.body?.endpoint || "");
    await supabaseServer.from("crm_push_subscriptions").delete().eq("endpoint", endpoint).eq("user_email", user.email);
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
