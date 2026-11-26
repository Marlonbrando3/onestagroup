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

  const listById = new Map(visibleLists.map((row) => [row.id, row]));
  const { data: events, error } = visibleLists.length
    ? await supabaseServer
        .from("presentation_events")
        .select("id,list_id,event_type,offer_external_id,offer_title,created_at")
        .in("list_id", visibleLists.map((row) => row.id))
        .order("created_at", { ascending: false })
        .limit(60)
    : { data: [], error: null };
  if (error) return res.status(500).json({ error: error.message });

  // Lead Manager: nowe leady z Facebooka i aktywność na /cbtop
  const visibleContactIds = Array.from(contactNames.keys());
  const [leadRows, trackingRows] = visibleContactIds.length
    ? await Promise.all([
        supabaseServer
          .from("lm_leads")
          .select("id,crm_contact_id,form_name,duplicate_of_existing,created_at")
          .in("crm_contact_id", visibleContactIds)
          .order("created_at", { ascending: false })
          .limit(40),
        supabaseServer
          .from("lm_tracking_events")
          .select("id,crm_contact_id,title,detail,created_at")
          .in("crm_contact_id", visibleContactIds)
          .order("created_at", { ascending: false })
          .limit(40),
      ])
    : [{ data: [] as any[] }, { data: [] as any[] }];
  const lmItems = [
    ...(leadRows.data || []).map((row: any) => ({
      id: `lead-${row.id}`,
      type: "lead" as const,
      verb: row.duplicate_of_existing ? "zgłosił(a) się ponownie z Facebooka" : "– nowy lead z Facebooka",
      offerId: null,
      offerTitle: row.form_name || "",
      createdAt: row.created_at,
      contactId: row.crm_contact_id,
      contactName: contactNames.get(row.crm_contact_id) || "Klient",
      presentationName: "",
      token: "",
      unread: !lastSeenAt || Date.parse(row.created_at) > Date.parse(lastSeenAt),
    })),
    ...(trackingRows.data || []).map((row: any) => ({
      id: `track-${row.id}`,
      type: "tracking" as const,
      verb: String(row.title || "").replace(/^./, (letter: string) => letter.toLocaleLowerCase("pl-PL")),
      offerId: null,
      offerTitle: row.detail || "",
      createdAt: row.created_at,
      contactId: row.crm_contact_id,
      contactName: contactNames.get(row.crm_contact_id) || "Klient",
      presentationName: "",
      token: "",
      unread: !lastSeenAt || Date.parse(row.created_at) > Date.parse(lastSeenAt),
    })),
  ];

  const presentationItems = (events || []).map((row: any) => {
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
      unread: !lastSeenAt || Date.parse(row.created_at) > Date.parse(lastSeenAt),
    };
  });

  // Wzorce z czatu: aktywność przypisana po linku leada (presentation_events.crm_contact_id)
  const { data: templateEvents } = visibleContactIds.length
    ? await supabaseServer
        .from("presentation_events")
        .select("id,list_id,event_type,offer_external_id,offer_title,created_at,crm_contact_id")
        .in("crm_contact_id", visibleContactIds)
        .order("created_at", { ascending: false })
        .limit(40)
    : { data: [] as any[] };
  const templateIds = Array.from(new Set((templateEvents || []).map((row: any) => row.list_id)));
  const { data: templateLists } = templateIds.length
    ? await supabaseServer.from("agent_offer_lists").select("id,presentation_name,public_token").in("id", templateIds)
    : { data: [] as any[] };
  const templatesById = new Map((templateLists || []).map((row: any) => [row.id, row]));
  const templateItems = (templateEvents || []).map((row: any) => {
    const template: any = templatesById.get(row.list_id);
    return {
      id: row.id,
      type: row.event_type,
      offerId: row.offer_external_id,
      offerTitle: row.offer_title || "",
      createdAt: row.created_at,
      contactId: row.crm_contact_id,
      contactName: contactNames.get(row.crm_contact_id) || "Klient",
      presentationName: `${String(template?.presentation_name || "Wzorzec").trim()} (z czatu)`,
      token: template?.public_token || "",
      unread: !lastSeenAt || Date.parse(row.created_at) > Date.parse(lastSeenAt),
    };
  });

  const items = [...presentationItems, ...templateItems, ...lmItems]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 60);

  return res.status(200).json({
    items,
    unread: items.filter((item) => item.unread).length,
    lastSeenAt,
  });
}
