import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateAgent } from "@/lib/agentAuthServer";
import { AGENT_OFFER_COLUMNS, AgentOffer } from "@/lib/agentOffers";
import { supabaseServer } from "@/lib/supabaseClient";

const MAX_OFFERS_PER_LIST = 100;

function cleanText(value: unknown, maxLength: number) {
  return String(value || "").trim().slice(0, maxLength);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function publicToken() {
  return crypto.randomBytes(18).toString("base64url");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  }

  const auth = await authenticateAgent(req);
  if (!auth.agent || !supabaseServer) {
    return res.status(auth.status).json({ error: auth.error });
  }

  if (req.method === "GET") {
    const { data, error } = await supabaseServer
      .from("agent_offer_lists")
      .select(
        "id,public_token,agent_email,agent_name,presentation_name,contact_name,contact_email,contact_phone,offers,created_at,updated_at",
      )
      .order("updated_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      data: (data || []).map((presentation) => ({
        ...presentation,
        offersCount: Array.isArray(presentation.offers)
          ? presentation.offers.length
          : 0,
        offers: undefined,
      })),
      agent: auth.agent,
    });
  }

  const presentationName = cleanText(req.body?.presentationName, 160);
  const contactName = cleanText(req.body?.contactName, 120);
  const contactEmail = cleanText(req.body?.contactEmail, 180).toLowerCase();
  const contactPhone = cleanText(req.body?.contactPhone, 60);

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

  const requestedIds: string[] = Array.isArray(req.body?.propertyIds)
    ? req.body.propertyIds.map((value: unknown) => String(value || "").trim())
    : [];
  const propertyIds: string[] = Array.from(
    new Set(requestedIds.filter((value): value is string => Boolean(value))),
  );

  if (!propertyIds.length) {
    return res.status(400).json({ error: "Dodaj przynajmniej jedną ofertę" });
  }
  if (propertyIds.length > MAX_OFFERS_PER_LIST) {
    return res.status(400).json({
      error: `Lista może zawierać maksymalnie ${MAX_OFFERS_PER_LIST} ofert`,
    });
  }

  const { data: properties, error: propertiesError } = await supabaseServer
    .from("properties")
    .select(AGENT_OFFER_COLUMNS)
    .in("external_id", propertyIds);

  if (propertiesError) {
    return res.status(500).json({ error: propertiesError.message });
  }

  const propertiesById = new Map(
    ((properties || []) as unknown as AgentOffer[]).map((property) => [
      String(property.external_id),
      property,
    ]),
  );
  const orderedOffers = propertyIds
    .map((id) => propertiesById.get(id))
    .filter((property): property is AgentOffer => Boolean(property));

  if (orderedOffers.length !== propertyIds.length) {
    return res.status(409).json({
      error: "Co najmniej jedna wybrana oferta nie jest już dostępna",
    });
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = publicToken();
    const { data, error } = await supabaseServer
      .from("agent_offer_lists")
      .insert({
        public_token: token,
        agent_user_id: auth.agent.id,
        agent_email: auth.agent.email,
        agent_name: auth.agent.name,
        presentation_name: presentationName,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        offers: orderedOffers,
      })
      .select("id,public_token,created_at")
      .single();

    if (!error && data) {
      return res.status(201).json({
        id: data.id,
        token: data.public_token,
        path: `/oferty/${data.public_token}`,
        createdAt: data.created_at,
        offersCount: orderedOffers.length,
      });
    }

    if (error?.code !== "23505") {
      return res.status(500).json({ error: error?.message || "Nie udało się zapisać listy" });
    }
  }

  return res.status(500).json({ error: "Nie udało się wygenerować unikatowego linku" });
}
