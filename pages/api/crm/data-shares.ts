import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { canAccessCrmContact, requireCrmUser } from "@/lib/crmServerAuth";
import { getCrmUser } from "@/components/crm/users";

// Rejestr przekazań danych klienta firmom partnerskim (komu, kiedy, w jakim celu, czy klient wiedział)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;
  const contactId = String((req.method === "GET" ? req.query.contactId : req.body?.contactId) || "");
  if (!(await canAccessCrmContact(user, contactId))) return res.status(403).json({ error: "Brak dostępu do tego kontaktu." });

  if (req.method === "GET") {
    const { data, error } = await supabaseServer
      .from("crm_data_shares")
      .select("id,created_at,purpose,scope,client_informed,recorded_by,partner:crm_partners(id,name,category,region,clause_accepted_at)")
      .eq("crm_contact_id", contactId)
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ shares: data || [] });
  }

  if (req.method === "POST") {
    const partnerId = String(req.body?.partnerId || "");
    const purpose = String(req.body?.purpose || "").trim().slice(0, 300);
    if (!partnerId || !purpose) return res.status(400).json({ error: "Wybierz partnera i wpisz cel przekazania." });
    if (req.body?.clientInformed !== true) {
      return res.status(400).json({ error: "Przed przekazaniem danych poinformuj klienta, komu i po co je przekazujesz." });
    }
    const { data, error } = await supabaseServer
      .from("crm_data_shares")
      .insert({
        crm_contact_id: contactId,
        partner_id: partnerId,
        purpose,
        scope: String(req.body?.scope || "").trim().slice(0, 300) || null,
        client_informed: true,
        recorded_by: getCrmUser(user.email)?.label || user.email,
      })
      .select("id")
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ id: data.id });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
