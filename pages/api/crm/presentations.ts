import type { NextApiRequest, NextApiResponse } from "next";
import { canAccessCrmContact, requireCrmUser } from "@/lib/crmServerAuth";
import { supabaseServer } from "@/lib/supabaseClient";

// Powiązanie kontaktu CRM z prezentacją ze strefy agenta (/agent/prezentacje)
// oraz aktywność klienta w powiązanych prezentacjach (otwarcia, kliknięte oferty, „Interesuje mnie”).

function mapPresentation(row: any) {
  return {
    id: row.id,
    name: String(row.presentation_name || "").trim() || "Prezentacja bez nazwy",
    clientName: String(row.client_name || "").trim(),
    agentName: String(row.agent_name || row.agent_email || "").trim(),
    createdAt: row.created_at,
    token: row.public_token,
    offersCount: Array.isArray(row.offers) ? row.offers.length : 0,
    crmContactId: row.crm_contact_id || null,
  };
}

const listColumns =
  "id,presentation_name,client_name,agent_name,agent_email,created_at,public_token,offers,crm_contact_id";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;

  if (req.method === "GET") {
    const contactId = String(req.query.contactId || "");

    // Prezentacje powiązane z kontaktem + ich aktywność
    if (contactId) {
      if (!(await canAccessCrmContact(user, contactId))) {
        return res.status(403).json({ error: "Brak dostepu do tego kontaktu." });
      }
      const { data: lists, error } = await supabaseServer
        .from("agent_offer_lists")
        .select(listColumns)
        .eq("crm_contact_id", contactId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) return res.status(500).json({ error: error.message });

      const presentations = (lists || []).map(mapPresentation);
      let events: any[] = [];
      if (presentations.length) {
        const { data: eventRows } = await supabaseServer
          .from("presentation_events")
          .select("id,list_id,event_type,offer_external_id,offer_title,created_at")
          .in("list_id", presentations.map((item) => item.id))
          .order("created_at", { ascending: false })
          .limit(300);
        const byId = new Map(presentations.map((item) => [item.id, item]));
        events = (eventRows || []).map((row) => ({
          id: row.id,
          type: row.event_type,
          offerId: row.offer_external_id,
          offerTitle: row.offer_title || "",
          createdAt: row.created_at,
          presentationId: row.list_id,
          presentationName: byId.get(row.list_id)?.name || "",
          token: byId.get(row.list_id)?.token || "",
        }));
      }

      // Wzorce z czatu (nieprzypisane): aktywność rozpoznana po linku leada
      const { data: leadEventRows } = await supabaseServer
        .from("presentation_events")
        .select("id,list_id,event_type,offer_external_id,offer_title,created_at")
        .eq("crm_contact_id", contactId)
        .order("created_at", { ascending: false })
        .limit(300);
      if (leadEventRows?.length) {
        const templateIds = Array.from(new Set(leadEventRows.map((row) => row.list_id)));
        const { data: templateLists } = await supabaseServer
          .from("agent_offer_lists")
          .select("id,presentation_name,public_title,public_token")
          .in("id", templateIds);
        const templates = new Map((templateLists || []).map((row: any) => [row.id, row]));
        const known = new Set(events.map((event) => event.id));
        events = [
          ...events,
          ...leadEventRows
            .filter((row) => !known.has(row.id))
            .map((row) => {
              const template: any = templates.get(row.list_id);
              return {
                id: row.id,
                type: row.event_type,
                offerId: row.offer_external_id,
                offerTitle: row.offer_title || "",
                createdAt: row.created_at,
                presentationId: row.list_id,
                presentationName: `${String(template?.presentation_name || "Wzorzec").trim()} (z czatu)`,
                token: template?.public_token || "",
                fromTemplate: true,
              };
            }),
        ].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      }

      if (req.query.markSeen === "1") {
        await supabaseServer
          .from("crm_contacts")
          .update({ presentation_seen_at: new Date().toISOString() })
          .eq("id", contactId);
      }
      return res.status(200).json({ presentations, events });
    }

    // Wyszukiwarka prezentacji do skojarzenia
    const q = String(req.query.q || "").trim().slice(0, 80);
    let query = supabaseServer
      .from("agent_offer_lists")
      .select(listColumns)
      .is("deleted_at", null)
      .eq("is_template", false)
      .order("created_at", { ascending: false })
      .limit(40);
    if (!user.isAdmin) query = query.eq("agent_email", user.email);
    if (q) {
      const safe = q.replace(/[%,()]/g, " ");
      query = query.or(
        `presentation_name.ilike.%${safe}%,client_name.ilike.%${safe}%,agent_name.ilike.%${safe}%`,
      );
    }
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ presentations: (data || []).map(mapPresentation) });
  }

  if (req.method === "POST" || req.method === "DELETE") {
    const presentationId = String(req.body?.presentationId || "");
    if (!presentationId) return res.status(400).json({ error: "Brak ID prezentacji." });

    let ownQuery = supabaseServer.from("agent_offer_lists").select("id,crm_contact_id,is_template").eq("id", presentationId);
    if (!user.isAdmin) ownQuery = ownQuery.eq("agent_email", user.email);
    const { data: presentation } = await ownQuery.maybeSingle();
    if (!presentation) return res.status(403).json({ error: "Brak dostepu do tej prezentacji." });
    if (req.method === "POST" && presentation.is_template) {
      return res.status(400).json({ error: "Wzorca z czatu nie przypisuje się do klienta – utwórz dla niego dedykowaną prezentację." });
    }

    if (req.method === "DELETE") {
      const { error } = await supabaseServer
        .from("agent_offer_lists")
        .update({ crm_contact_id: null })
        .eq("id", presentationId);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ unlinked: true });
    }

    const contactId = String(req.body?.contactId || "");
    if (!(await canAccessCrmContact(user, contactId))) {
      return res.status(403).json({ error: "Brak dostepu do tego kontaktu." });
    }
    const { data, error } = await supabaseServer
      .from("agent_offer_lists")
      .update({ crm_contact_id: contactId })
      .eq("id", presentationId)
      .select(listColumns)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ presentation: mapPresentation(data) });
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
