import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { canAccessCrmContact, requireCrmUser } from "@/lib/crmServerAuth";

// Historia z Lead Managera dla karty klienta: zgłoszenia z Facebooka, SMS powitalny, aktywność na /cbtop.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const contactId = String(req.query.contactId || "");
  if (!(await canAccessCrmContact(user, contactId))) return res.status(403).json({ error: "Brak dostępu do tego kontaktu." });

  const [leads, sms, events] = await Promise.all([
    supabaseServer
      .from("lm_leads")
      .select("id,created_at,source,form_name,campaign_name,duplicate_of_existing")
      .eq("crm_contact_id", contactId)
      .order("created_at", { ascending: false }),
    supabaseServer
      .from("lm_sms_deliveries")
      .select("id,created_at,status,provider,message,error")
      .eq("crm_contact_id", contactId)
      .eq("audience", "lead")
      .order("created_at", { ascending: false }),
    supabaseServer
      .from("lm_tracking_events")
      .select("id,created_at,event,offer_id,title,detail")
      .eq("crm_contact_id", contactId)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const items = [
    ...(leads.data || []).map((row) => ({
      id: `lead-${row.id}`,
      kind: "lead" as const,
      createdAt: row.created_at,
      title: row.duplicate_of_existing ? "Ponowne zgłoszenie z Facebooka" : row.source === "diagnostic" ? "Lead testowy (Lead Manager)" : "Lead z Facebooka",
      detail: [row.form_name ? `Formularz: ${row.form_name}` : "", row.campaign_name ? `Kampania: ${row.campaign_name}` : ""].filter(Boolean).join(" • "),
    })),
    ...(sms.data || []).map((row) => ({
      id: `sms-${row.id}`,
      kind: "sms" as const,
      createdAt: row.created_at,
      title:
        row.status === "sent" ? "Wysłano SMS powitalny" : row.status === "simulated" ? "SMS powitalny – symulacja (nie wysłano)" : "SMS powitalny niewysłany",
      detail: row.status === "failed" ? row.error || "" : row.message,
    })),
    ...(events.data || []).map((row) => ({
      id: `track-${row.id}`,
      kind: "tracking" as const,
      event: row.event,
      createdAt: row.created_at,
      title: row.title,
      detail: row.detail || "",
    })),
  ].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  return res.status(200).json({ items });
}
