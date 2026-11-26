import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { requireCrmUser } from "@/lib/crmServerAuth";
import { PARTNER_CATEGORIES } from "@/components/crm/partnerCategories";

// Rejestr firm partnerskich (komu przekazujemy dane klientów). Lista – wszyscy w CRM; zmiany – administratorzy.
const str = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

function payloadFrom(body: any) {
  const category = PARTNER_CATEGORIES.some((item) => item.value === body?.category) ? body.category : "inne";
  const clause = str(body?.clauseAcceptedAt, 10);
  return {
    name: str(body?.name, 160),
    category,
    region: str(body?.region, 120) || null,
    contact: str(body?.contact, 240) || null,
    role: body?.role === "processor" ? "processor" : "administrator",
    clause_accepted_at: /^\d{4}-\d{2}-\d{2}$/.test(clause) ? clause : null,
    clause_note: str(body?.clauseNote, 500) || null,
    archived: Boolean(body?.archived),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;

  if (req.method === "GET") {
    const { data, error } = await supabaseServer.from("crm_partners").select("*").order("name");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ partners: data || [] });
  }

  if (!user.isAdmin) return res.status(403).json({ error: "Partnerów mogą edytować administratorzy." });

  if (req.method === "POST" || req.method === "PATCH") {
    const payload = payloadFrom(req.body);
    if (!payload.name) return res.status(400).json({ error: "Podaj nazwę firmy." });
    const query =
      req.method === "POST"
        ? supabaseServer.from("crm_partners").insert(payload)
        : supabaseServer.from("crm_partners").update(payload).eq("id", String(req.body?.id || ""));
    const { data, error } = await query.select("*").single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ partner: data });
  }

  res.setHeader("Allow", "GET, POST, PATCH");
  return res.status(405).json({ error: "Method not allowed" });
}
