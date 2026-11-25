import type { NextApiRequest, NextApiResponse } from "next";
import { requireCrmUser } from "@/lib/crmServerAuth";
import { supabaseServer } from "@/lib/supabaseClient";

// Dzwonek w CRM: aktywność klientów w prezentacjach powiązanych z ich kartami.
// Zwykły użytkownik widzi swoich klientów, administrator — wszystkich.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;

  if (req.method === "POST") {
    const { error } = await supabaseServer
      .from("crm_event_reads")
      .upsert({ user_email: user.email, last_seen_at: new Date().toISOString() });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let contactsQuery = supabaseServer.from("crm_contacts").select("id,name");
  if (!user.isAdmin) contactsQuery = contactsQuery.eq("pipeline_owner", user.email);
  const { data: contacts, error: contactsError } = await contactsQuery;
  if (contactsError) return res.status(500).json({ error: contactsError.message });
  const contactNames = new Map((contacts || []).map((row) => [row.id, row.name || "Klient"]));

  const { data: lists } = await supabaseServer
    .from("agent_offer_lists")
    .select("id,presentation_name,public_token,crm_contact_id")
    .not("crm_contact_id", "is", null);
  const visibleLists = (lists || []).filter((row) => contactNames.has(row.crm_contact_id));

  const { data: read } = await supabaseServer
    .from("crm_event_reads")
    .select("last_seen_at")
    .eq("user_email", user.email)
    .maybeSingle();
  const lastSeenAt = read?.last_seen_at || null;

  if (!visibleLists.length) {
    return res.status(200).json({ items: [], unread: 0, lastSeenAt });
  }

  const listById = new Map(visibleLists.map((row) => [row.id, row]));
  const { data: events, error } = await supabaseServer
    .from("presentation_events")
    .select("id,list_id,event_type,offer_external_id,offer_title,created_at")
    .in("list_id", visibleLists.map((row) => row.id))
    .order("created_at", { ascending: false })
    .limit(60);
  if (error) return res.status(500).json({ error: error.message });

  const items = (events || []).map((row) => {
    const list = listById.get(row.list_id)!;
    return {
      id: row.id,
      type: row.event_type,
      offerId: row.offer_external_id,
      offerTitle: row.offer_title || "",
      createdAt: row.created_at,
      contactId: list.crm_contact_id,
      contactName: contactNames.get(list.crm_contact_id) || "Klient",
      presentationName: String(list.presentation_name || "").trim() || "Prezentacja",
      token: list.public_token,
      unread: !lastSeenAt || row.created_at > lastSeenAt,
    };
  });

  return res.status(200).json({
    items,
    unread: items.filter((item) => item.unread).length,
    lastSeenAt,
  });
}
