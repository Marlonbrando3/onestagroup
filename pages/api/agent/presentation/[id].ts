import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateAgent } from "@/lib/agentAuthServer";
import type { AgentOffer } from "@/lib/agentOffers";
import { supabaseServer } from "@/lib/supabaseClient";

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
  if (req.method !== "GET" && req.method !== "PUT") {
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
      "id,public_token,agent_email,agent_name,presentation_name,contact_name,contact_email,contact_phone,offers,created_at,updated_at",
    )
    .eq("id", id)
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

  const presentationName = cleanText(req.body?.presentationName, 160);
  const contactName = cleanText(req.body?.contactName, 120);
  const contactEmail = cleanText(req.body?.contactEmail, 180).toLowerCase();
  const contactPhone = cleanText(req.body?.contactPhone, 60);
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
      offers: orderedOffers,
      updated_at: updatedAt,
    })
    .eq("id", id)
    .select(
      "id,public_token,agent_email,agent_name,presentation_name,contact_name,contact_email,contact_phone,offers,created_at,updated_at",
    )
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data, agent: auth.agent });
}
