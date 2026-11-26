import type { NextApiRequest, NextApiResponse } from "next";
import { resolvePublicOfferListToken } from "@/lib/publicOfferListToken";
import { supabaseServer } from "@/lib/supabaseClient";
import { notifyPresentationActivity } from "@/lib/crmReminders";
import { resolveLeadKey } from "@/lib/leadManager/tracking";

// Aktywność klienta w prezentacji /oferty/[token]: otwarcie prezentacji i otwarcie konkretnej oferty.
// („Interesuje mnie ta oferta” zapisuje /api/presentation-interest.)
// Każde wejście klienta = zdarzenie + powiadomienie push + sygnał w lejku.
// Powtórki w obrębie jednej karty przeglądarki (powrót z oferty do prezentacji) odsiewa strona klienta
// (lib/presentationTracking.ts); tutaj tylko krótka blokada na podwójne wysłanie tego samego żądania.
const DEDUPE_SECONDS = 20;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false });
  }
  if (!supabaseServer) return res.status(500).json({ success: false });

  const body = (req.body ?? {}) as Record<string, unknown>;
  const type = body.type === "offer_view" ? "offer_view" : body.type === "open" ? "open" : "";
  const token = await resolvePublicOfferListToken(body.token);
  if (!type || !token) return res.status(400).json({ success: false });

  const { data: list } = await supabaseServer
    .from("agent_offer_lists")
    .select("id,offers,is_template")
    .eq("public_token", token)
    .maybeSingle();
  if (!list) return res.status(404).json({ success: false });

  // Wzorzec (pula czatu): zapisujemy tylko wejścia z linkiem leada (?k=…), przypisując je do jego karty w CRM
  let lead: { contactId: string; leadId: string } | null = null;
  if (list.is_template) {
    lead = await resolveLeadKey(body.k);
    if (!lead) return res.status(200).json({ success: true, skipped: true });
  }

  let offerId: string | null = null;
  let offerTitle: string | null = null;
  if (type === "offer_view") {
    offerId = String(body.offerId ?? "").trim().slice(0, 120) || null;
    const offer = Array.isArray(list.offers)
      ? (list.offers as any[]).find((item) => String(item?.external_id) === offerId)
      : null;
    if (!offerId) return res.status(400).json({ success: false });
    offerTitle = offer?.title ? String(offer.title).slice(0, 300) : String(body.offerTitle ?? "").slice(0, 300) || null;
  }

  const since = new Date(Date.now() - DEDUPE_SECONDS * 1000).toISOString();
  let recentQuery = supabaseServer
    .from("presentation_events")
    .select("id")
    .eq("list_id", list.id)
    .eq("event_type", type)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1);
  recentQuery = offerId ? recentQuery.eq("offer_external_id", offerId) : recentQuery;
  recentQuery = lead ? recentQuery.eq("crm_contact_id", lead.contactId) : recentQuery;
  const { data: recent } = await recentQuery;
  if (recent?.length) return res.status(200).json({ success: true, deduped: true });

  const { error } = await supabaseServer.from("presentation_events").insert({
    list_id: list.id,
    event_type: type,
    offer_external_id: offerId,
    offer_title: offerTitle,
    ...(lead ? { crm_contact_id: lead.contactId, lead_id: lead.leadId } : {}),
  });
  if (error) {
    console.error("presentation-event: nie zapisano zdarzenia", error);
    return res.status(500).json({ success: false });
  }
  try {
    await notifyPresentationActivity(list.id, type, offerTitle, lead?.contactId);
  } catch (pushError) {
    console.error("presentation-event: push", pushError);
  }
  return res.status(200).json({ success: true });
}
