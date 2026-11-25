import type { NextApiRequest, NextApiResponse } from "next";
import { resolvePublicOfferListToken } from "@/lib/publicOfferListToken";
import { supabaseServer } from "@/lib/supabaseClient";
import { notifyPresentationActivity } from "@/lib/crmReminders";

// Aktywność klienta w prezentacji /oferty/[token]: otwarcie prezentacji i otwarcie konkretnej oferty.
// („Interesuje mnie ta oferta” zapisuje /api/presentation-interest.)
// Te same zdarzenia w ciągu 10 minut liczymy raz (odświeżenie strony, powrót z oferty),
// ale tylko dopóki agent ich nie zobaczył – każde wejście po otwarciu karty klienta zapala sygnał w lejku na nowo.
// Powiadomienie push wysyłamy najwyżej raz na 10 minut dla tego samego zdarzenia.
const DEDUPE_MINUTES = 10;

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
    .select("id,offers,crm_contact_id")
    .eq("public_token", token)
    .maybeSingle();
  if (!list) return res.status(404).json({ success: false });

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

  const since = new Date(Date.now() - DEDUPE_MINUTES * 60 * 1000).toISOString();
  let recentQuery = supabaseServer
    .from("presentation_events")
    .select("id,created_at")
    .eq("list_id", list.id)
    .eq("event_type", type)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1);
  recentQuery = offerId ? recentQuery.eq("offer_external_id", offerId) : recentQuery;
  const { data: recent } = await recentQuery;
  const recentEvent = recent?.[0];
  if (recentEvent) {
    let seenAt: string | null = null;
    if (list.crm_contact_id) {
      const { data: contact } = await supabaseServer
        .from("crm_contacts")
        .select("presentation_seen_at")
        .eq("id", list.crm_contact_id)
        .maybeSingle();
      seenAt = contact?.presentation_seen_at || null;
    }
    const alreadySeen = seenAt && Date.parse(seenAt) >= Date.parse(recentEvent.created_at);
    if (!alreadySeen) return res.status(200).json({ success: true, deduped: true });
  }

  const { error } = await supabaseServer.from("presentation_events").insert({
    list_id: list.id,
    event_type: type,
    offer_external_id: offerId,
    offer_title: offerTitle,
  });
  if (error) {
    console.error("presentation-event: nie zapisano zdarzenia", error);
    return res.status(500).json({ success: false });
  }
  try {
    if (!recentEvent) await notifyPresentationActivity(list.id, type, offerTitle);
  } catch (pushError) {
    console.error("presentation-event: push", pushError);
  }
  return res.status(200).json({ success: true });
}
