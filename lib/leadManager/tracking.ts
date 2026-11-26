import { supabaseServer } from "@/lib/supabaseClient";
import { sendCrmPush } from "@/lib/crmPush";

// Linki śledzące z SMS-a (onesta.com.pl/r/<token> → /cbtop#lm=<token>) i aktywność leada na /cbtop.
// Token jest szyfrowany (AES-GCM), ważny 90 dni, zawiera ID leada i kontaktu w CRM.

const TRACKED_OFFERS = {
  costa_blanca: { label: "TOP 20 Costa Blanca", destinationUrl: "https://onesta.com.pl/cbtop" },
  chat: { label: "Czat ofertowy", destinationUrl: "https://onesta.com.pl/czat" },
} as const;
type OfferKey = keyof typeof TRACKED_OFFERS;

export const LM_TRACKED_EVENTS = [
  "sms_link_open",
  "property_open",
  "property_like",
  "contact_form_submit",
  "whatsapp_click",
  "phone_click",
  "email_click",
  "urgent_contact_request",
] as const;
export type LmTrackedEvent = (typeof LM_TRACKED_EVENTS)[number];
const CONTEXTS = ["hero", "property_modal", "page_footer", "floating"] as const;
type LmContext = (typeof CONTEXTS)[number];

type TokenPayload = { version: 2; leadId: string; contactId: string; offerKey: OfferKey; expiresAt: number };

const encoder = new TextEncoder();
const decoder = new TextDecoder();
let keyPromise: Promise<CryptoKey> | undefined;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function trackingKey() {
  if (!keyPromise) {
    const secret = (process.env.LEAD_MANAGER_TRACKING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
    if (!secret) throw new Error("Brak klucza do zabezpieczenia linków SMS.");
    keyPromise = crypto.subtle
      .digest("SHA-256", encoder.encode(`onesta-lead-manager-sms:${secret}`))
      .then((digest) => crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]));
  }
  return keyPromise;
}

async function createToken(leadId: string, contactId: string, offerKey: OfferKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const payload: TokenPayload = { version: 2, leadId, contactId, offerKey, expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000 };
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await trackingKey(), encoder.encode(JSON.stringify(payload)));
  return Buffer.concat([Buffer.from(iv), Buffer.from(encrypted)]).toString("base64url");
}

export async function readLmTrackingToken(token: string): Promise<TokenPayload | null> {
  try {
    const bytes = Buffer.from(token, "base64url");
    if (bytes.length < 29) return null;
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.subarray(0, 12) }, await trackingKey(), bytes.subarray(12));
    const payload = JSON.parse(decoder.decode(decrypted)) as Partial<TokenPayload>;
    if (
      payload.version !== 2 ||
      !UUID.test(String(payload.leadId)) ||
      !UUID.test(String(payload.contactId)) ||
      !(String(payload.offerKey) in TRACKED_OFFERS) ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt < Date.now()
    ) {
      return null;
    }
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://onesta.com.pl").replace(/\/+$/, "");
}

// Klucz leada w linku do wzorca prezentacji (?k=…): kto ogląda, bez przypisywania prezentacji
export async function resolveLeadKey(value: unknown) {
  const key = String(value || "").trim();
  if (key.length < 20 || key.length > 2048 || !/^[A-Za-z0-9_-]+$/.test(key)) return null;
  const payload = await readLmTrackingToken(key);
  return payload ? { contactId: payload.contactId, leadId: payload.leadId } : null;
}

export async function createTrackedOfferLinks(leadId: string, contactId: string, shorten: boolean) {
  const token = await createToken(leadId, contactId, "costa_blanca");
  const url = `${siteOrigin()}/r/${token}`;
  const link = shorten ? `[%idzdo:${url}%]` : url;
  const chatToken = await createToken(leadId, contactId, "chat");
  const chatUrl = `${siteOrigin()}/czat/${chatToken}`;
  return { cbTop: link, costaBlanca: link, chat: shorten ? `[%idzdo:${chatUrl}%]` : chatUrl };
}

export async function resolveLmTrackedLink(token: string) {
  const payload = await readLmTrackingToken(token);
  if (!payload) return null;
  if (payload.offerKey === "chat") return `${TRACKED_OFFERS.chat.destinationUrl}/${token}`;
  const destination = new URL(TRACKED_OFFERS[payload.offerKey].destinationUrl);
  destination.hash = new URLSearchParams({ lm: token }).toString();
  return destination.toString();
}

const CONTEXT_LABELS: Record<LmContext, string> = {
  hero: "nagłówku strony",
  property_modal: "oknie oferty",
  page_footer: "formularzu na końcu strony",
  floating: "pływającym przycisku",
};

export const LM_EVENT_PUSH: Partial<Record<LmTrackedEvent, string>> = {
  sms_link_open: "👀 otworzył(a) link z SMS-a (TOP 20)",
  property_open: "👀 ogląda ofertę",
  property_like: "❤️ polubił(a) ofertę",
  contact_form_submit: "✉️ wysłał(a) formularz",
  whatsapp_click: "💬 kliknął(a) WhatsApp",
  phone_click: "📞 kliknął(a) numer telefonu",
  email_click: "✉️ kliknął(a) e-mail",
  urgent_contact_request: "🚨 PROSI O PILNY KONTAKT",
};

// Zapis zdarzenia czatu (otwarcie / wybór) – wywoływane z lib/leadManager/chat.ts
export async function insertLmEvent(input: {
  contactId: string;
  leadId?: string | null;
  event: LmTrackedEvent | "chat_open" | "chat_completed";
  title: string;
  detail?: string;
}) {
  if (!supabaseServer) return;
  await supabaseServer.from("lm_tracking_events").insert({
    crm_contact_id: input.contactId,
    lead_id: input.leadId || null,
    event: input.event,
    title: input.title.slice(0, 300),
    detail: input.detail ? input.detail.slice(0, 2000) : null,
  });
}

export async function recordLmTrackingEvent(input: { token: string; event: string; context?: string; offerId?: string }) {
  if (!supabaseServer) return null;
  const payload = await readLmTrackingToken(input.token);
  if (!payload) return null;
  if (!LM_TRACKED_EVENTS.includes(input.event as LmTrackedEvent)) return null;
  const event = input.event as LmTrackedEvent;
  const context = CONTEXTS.includes(input.context as LmContext) ? (input.context as LmContext) : undefined;
  const offerId = input.offerId?.trim();
  if (offerId && !/^[a-z0-9_-]{1,80}$/i.test(offerId)) return null;
  if ((event === "property_open" || event === "property_like") && !offerId) return null;

  const { data: contact } = await supabaseServer
    .from("crm_contacts")
    .select("id,name,phone,pipeline_owner")
    .eq("id", payload.contactId)
    .maybeSingle();
  if (!contact) return null;

  // Pilny kontakt: najwyżej raz na 10 minut
  if (event === "urgent_contact_request") {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recent } = await supabaseServer
      .from("lm_tracking_events")
      .select("id")
      .eq("crm_contact_id", contact.id)
      .eq("event", event)
      .gte("created_at", since)
      .limit(1);
    if (recent?.length) return { contactId: contact.id, urgentContactStatus: "already_sent" as const };
  }

  const where = context ? ` w ${CONTEXT_LABELS[context]}` : "";
  const offer = offerId ? ` Oferta: ${offerId}.` : "";
  const copy: Record<LmTrackedEvent, { title: string; detail: string }> = {
    sms_link_open: { title: "Otworzył(a) link z SMS-a – TOP 20 Costa Blanca", detail: "Lead wszedł na /cbtop z linku w SMS-ie." },
    property_open: { title: `Otworzył(a) ofertę ${offerId}`, detail: `Szczegóły nieruchomości na /cbtop.${offer}` },
    property_like: { title: `Polubił(a) ofertę ${offerId}`, detail: `Kliknięto „Podoba mi się” na /cbtop.${offer}` },
    contact_form_submit: {
      title: offerId ? `Wysłał(a) formularz dla oferty ${offerId}` : "Wysłał(a) formularz na /cbtop",
      detail: `Formularz kontaktowy${where}.${offer}`,
    },
    whatsapp_click: { title: "Kliknął(a) WhatsApp", detail: `Kontakt przez WhatsApp${where}.${offer}` },
    phone_click: { title: "Kliknął(a) numer telefonu", detail: `Numer telefonu${where}.${offer}` },
    email_click: { title: "Kliknął(a) adres e-mail", detail: `Adres e-mail${where}.${offer}` },
    urgent_contact_request: { title: "Pilna prośba o kontakt", detail: `Lead prosi o pilny kontakt (tel. ${contact.phone}). Zadzwoń w ciągu kilku minut.` },
  };

  const { error } = await supabaseServer.from("lm_tracking_events").insert({
    crm_contact_id: contact.id,
    lead_id: payload.leadId,
    event,
    offer_id: offerId || null,
    title: copy[event].title,
    detail: copy[event].detail,
  });
  if (error?.code === "23505" && event === "property_like") return { contactId: contact.id, alreadyRecorded: true as const };
  if (error) throw error;

  const pushText = LM_EVENT_PUSH[event];
  if (pushText && contact.pipeline_owner) {
    try {
      await sendCrmPush(contact.pipeline_owner, {
        title: `${event === "urgent_contact_request" ? "🚨 " : ""}${contact.name || "Lead"} ${pushText.replace(/^🚨 /, "")}`,
        body: event === "urgent_contact_request" ? `Zadzwoń: ${contact.phone}` : copy[event].detail,
        url: `/crm/kontakt/${contact.id}`,
        tag: `lm-${contact.id}-${Date.now()}`,
      });
    } catch (pushError) {
      console.error("lead manager tracking: push", pushError);
    }
  }
  return {
    contactId: contact.id,
    urgentContactStatus: event === "urgent_contact_request" ? ("sent" as const) : undefined,
  };
}
