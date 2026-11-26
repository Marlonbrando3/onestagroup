import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateAgent } from "@/lib/agentAuthServer";
import { resolveCrmContactLink } from "@/lib/crmContactLink";
import { AGENT_OFFER_COLUMNS, AgentOffer } from "@/lib/agentOffers";
import { supabaseServer } from "@/lib/supabaseClient";

const MAX_OFFERS_PER_LIST = 100;
const TEMPLATE_OWNER_EMAIL = "marek.marszalek@onesta.com.pl";

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
        "id,public_token,agent_email,agent_name,presentation_name,contact_name,contact_email,contact_phone,client_salutation,client_name,offers,created_at,updated_at,is_template,public_title,public_subtitle,crm_contact:crm_contacts(id,name)",
      )
      .is("deleted_at", null)
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
  // Zwrot i imię klienta do nagłówka prezentacji („Oferty wybrane dla Pana Jana Kowalskiego”).
  const salutationRaw = String(req.body?.clientSalutation || "").trim().toLowerCase();
  const clientSalutation = ["pani", "pan", "panstwo"].includes(salutationRaw) ? salutationRaw : null;
  const clientName = cleanText(req.body?.clientName, 120) || null;
  // Wzorzec (pula czatu ofertowego): bez klienta i bez przypisania do CRM, z własnym tytułem dla odbiorcy.
  const isTemplate = Boolean(req.body?.isTemplate);
  const publicTitle = cleanText(req.body?.publicTitle, 160) || null;
  const publicSubtitle = cleanText(req.body?.publicSubtitle, 160) || null;
  if (isTemplate && auth.agent.email.toLowerCase() !== TEMPLATE_OWNER_EMAIL) {
    return res.status(403).json({ error: "Wzorce prezentacji może tworzyć tylko Marek" });
  }
  if (isTemplate && !publicTitle) {
    return res.status(400).json({ error: "Podaj tytuł widoczny dla klienta" });
  }

  if (!presentationName) {
    return res.status(400).json({ error: "Podaj nazwę prezentacji" });
  }
  const crmLink = await resolveCrmContactLink(auth.agent.email, isTemplate ? null : req.body?.crmContactId);
  if (!crmLink.ok) {
    return res.status(400).json({ error: crmLink.error });
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
        client_salutation: isTemplate ? null : clientSalutation,
        client_name: isTemplate ? null : clientName,
        is_template: isTemplate,
        public_title: isTemplate ? publicTitle : null,
        public_subtitle: isTemplate ? publicSubtitle : null,
        offers: orderedOffers,
        ...(isTemplate ? { crm_contact_id: null } : crmLink.contactId !== undefined ? { crm_contact_id: crmLink.contactId } : {}),
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
