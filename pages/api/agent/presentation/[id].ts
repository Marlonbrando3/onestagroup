import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateAgent } from "@/lib/agentAuthServer";
import type { AgentOffer } from "@/lib/agentOffers";
import { supabaseServer } from "@/lib/supabaseClient";
import { CBTOP_SOURCE_PRESENTATION_TOKEN } from "@/lib/cbTopOffers";

const MAX_OFFERS_PER_LIST = 100;

function cleanText(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET" && req.method !== "PUT" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = await authenticateAgent(req);
  if (!auth.agent || !supabaseServer) {
    return res.status(auth.status).json({ error: auth.error });
  }

  const id = String(req.query.id || "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return res.status(400).json({ error: "Nieprawidłowy identyfikator prezentacji" });
  }

  const { data: presentation, error: presentationError } = await supabaseServer
    .from("agent_offer_lists")
    .select(
      "id,public_token,agent_user_id,agent_email,agent_name,presentation_name,contact_name,contact_email,contact_phone,client_salutation,client_name,offers,created_at,updated_at",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (presentationError) {
    return res.status(500).json({ error: presentationError.message });
  }
  if (!presentation) {
    return res.status(404).json({ error: "Nie znaleziono prezentacji" });
  }

  if (req.method === "GET") {
    return res.status(200).json({ data: presentation, agent: auth.agent });
  }

  // Usunięcie prezentacji (miękkie: znika z listy, link przestaje działać; dane zostają w bazie).
  // Może usunąć autor prezentacji albo Marek.
  if (req.method === "DELETE") {
    const isAuthor =
      presentation.agent_user_id === auth.agent.id ||
      String(presentation.agent_email || "").toLowerCase() === auth.agent.email.toLowerCase();
    const isOwner = auth.agent.email.toLowerCase() === "marek.marszalek@onesta.com.pl";
    if (!isAuthor && !isOwner) {
      return res.status(403).json({ error: "Prezentację może usunąć tylko jej autor" });
    }
    if (presentation.public_token === CBTOP_SOURCE_PRESENTATION_TOKEN) {
      return res.status(400).json({ error: "Ta prezentacja zasila stronę CBTOP i nie może zostać usunięta" });
    }
    const { error } = await supabaseServer
      .from("agent_offer_lists")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  const presentationName = cleanText(req.body?.presentationName, 160);
  const contactName = cleanText(req.body?.contactName, 120);
  const contactEmail = cleanText(req.body?.contactEmail, 180).toLowerCase();
  const contactPhone = cleanText(req.body?.contactPhone, 60);
  // Zwrot i imię klienta do nagłówka prezentacji („Oferty wybrane dla Pana Jana Kowalskiego”).
  const salutationRaw = String(req.body?.clientSalutation || "").trim().toLowerCase();
  const clientSalutation = ["pani", "pan", "panstwo"].includes(salutationRaw) ? salutationRaw : null;
  const clientName = cleanText(req.body?.clientName, 120) || null;
  const requestedIds: string[] = Array.isArray(req.body?.propertyIds)
    ? req.body.propertyIds.map((value: unknown) => String(value || "").trim())
    : [];
  const propertyIds = Array.from(new Set(requestedIds.filter(Boolean)));

  if (!presentationName) {
    return res.status(400).json({ error: "Podaj nazwę prezentacji" });
  }
  if (!contactName || !contactEmail || !contactPhone) {
    return res.status(400).json({
      error: "Uzupełnij imię i nazwisko, e-mail oraz numer telefonu",
    });
  }
  if (!validEmail(contactEmail)) {
    return res.status(400).json({ error: "Podaj poprawny adres e-mail" });
  }
  if (!propertyIds.length) {
    return res.status(400).json({ error: "Prezentacja musi zawierać ofertę" });
  }
  if (propertyIds.length > MAX_OFFERS_PER_LIST) {
    return res.status(400).json({
      error: `Prezentacja może zawierać maksymalnie ${MAX_OFFERS_PER_LIST} ofert`,
    });
  }

  const storedOffers = Array.isArray(presentation.offers)
    ? (presentation.offers as unknown as AgentOffer[])
    : [];
  const offersById = new Map(
    storedOffers.map((offer) => [String(offer.external_id), offer]),
  );
  const orderedOffers = propertyIds
    .map((propertyId) => offersById.get(propertyId))
    .filter((offer): offer is AgentOffer => Boolean(offer));

  if (orderedOffers.length !== propertyIds.length) {
    return res.status(400).json({
      error: "Do prezentacji można pozostawić wyłącznie zapisane wcześniej oferty",
    });
  }

  const updatedAt = new Date().toISOString();
  const { data, error } = await supabaseServer
    .from("agent_offer_lists")
    .update({
      presentation_name: presentationName,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      client_salutation: clientSalutation,
      client_name: clientName,
      offers: orderedOffers,
      updated_at: updatedAt,
    })
    .eq("id", id)
    .select(
      "id,public_token,agent_email,agent_name,presentation_name,contact_name,contact_email,contact_phone,client_salutation,client_name,offers,created_at,updated_at",
    )
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data, agent: auth.agent });
}
