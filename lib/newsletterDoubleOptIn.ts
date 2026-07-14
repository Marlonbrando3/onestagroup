import crypto from "crypto";
import type { IncomingMessage } from "http";
import { supabaseServer } from "@/lib/supabaseClient";

export const NEWSLETTER_TEST_RECIPIENT = "onesta.gads@gmail.com";
export const NEWSLETTER_CONSENT_VERSION = "newsletter-email-v2-2026-07-14";
export const NEWSLETTER_EMAIL_TEMPLATE_VERSION = "newsletter-confirmation-v1-2026-07-14";
export const NEWSLETTER_EVIDENCE_VERSION = "onesta-consent-evidence-v1";
export const NEWSLETTER_CONSENT_TEXT =
  "Wyrażam zgodę na otrzymywanie od Onesta Group Sp. z o.o. newslettera oraz informacji handlowych i marketingowych drogą elektroniczną na podany adres e-mail. Wiem, że zgodę mogę wycofać w każdej chwili. Zapoznałem/am się z Polityką Prywatności: https://onesta.com.pl/polityka-prywatnosci.";

export function normalizeNewsletterEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

export function isNewsletterTestRecipient(emailValue: string, testRecipientValue = NEWSLETTER_TEST_RECIPIENT) {
  const email = normalizeNewsletterEmail(emailValue);
  const testRecipient = normalizeNewsletterEmail(testRecipientValue);
  if (email === testRecipient) return true;
  const [testLocal, testDomain] = testRecipient.split("@");
  const [local, domain] = email.split("@");
  return Boolean(testLocal && testDomain && domain === testDomain && local?.startsWith(`${testLocal}+`));
}

export function isNewsletterEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((result, key) => {
        const item = (value as Record<string, unknown>)[key];
        if (typeof item !== "undefined") result[key] = canonicalize(item);
        return result;
      }, {});
  }
  return value;
}

export function stableCanonicalJson(value: unknown) {
  return JSON.stringify(canonicalize(value));
}

function evidenceSigningSecret() {
  const secret =
    process.env.NEWSLETTER_EVIDENCE_SIGNING_SECRET ||
    process.env.NEWSLETTER_TOKEN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Brak NEWSLETTER_EVIDENCE_SIGNING_SECRET w konfiguracji serwera.");
  return secret;
}

export function signNewsletterEvidenceHash(payloadHash: string) {
  return crypto.createHmac("sha256", evidenceSigningSecret()).update(payloadHash).digest("hex");
}

export function verifyNewsletterEvidenceSignature(payloadHash: string, signature: string) {
  const expected = Buffer.from(signNewsletterEvidenceHash(payloadHash));
  const actual = Buffer.from(String(signature || ""));
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function newsletterArchiveSecret() {
  const secret =
    process.env.NEWSLETTER_ARCHIVE_SECRET ||
    process.env.NEWSLETTER_TOKEN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Brak NEWSLETTER_ARCHIVE_SECRET w konfiguracji serwera.");
  return secret;
}

export function encryptNewsletterArchive(value: unknown) {
  const key = crypto.createHash("sha256").update(newsletterArchiveSecret()).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(stableCanonicalJson(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return {
    algorithm: "aes-256-gcm",
    iv: iv.toString("base64url"),
    authTag: cipher.getAuthTag().toString("base64url"),
    ciphertext: ciphertext.toString("base64url"),
  };
}

export function decryptNewsletterArchive(value: any) {
  if (!value?.iv || !value?.authTag || !value?.ciphertext) return null;
  const key = crypto.createHash("sha256").update(newsletterArchiveSecret()).digest();
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(String(value.iv), "base64url"),
  );
  decipher.setAuthTag(Buffer.from(String(value.authTag), "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(String(value.ciphertext), "base64url")),
    decipher.final(),
  ]).toString("utf8");
  return JSON.parse(plaintext);
}

export function createConfirmationToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function newsletterTokenSecret() {
  const secret = process.env.NEWSLETTER_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Brak NEWSLETTER_TOKEN_SECRET w konfiguracji serwera.");
  return secret;
}

export function createNewsletterUnsubscribeToken(subscriptionId: string, email: string) {
  const signature = crypto
    .createHmac("sha256", newsletterTokenSecret())
    .update(`newsletter-unsubscribe-v1:${subscriptionId}:${normalizeNewsletterEmail(email)}`)
    .digest("base64url");
  return `${subscriptionId}.${signature}`;
}

export function parseNewsletterUnsubscribeToken(token: string) {
  const [subscriptionId, signature] = token.split(".");
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(subscriptionId || "") || !signature) return null;
  return { subscriptionId, signature };
}

export function verifyNewsletterUnsubscribeToken(token: string, email: string) {
  const parsed = parseNewsletterUnsubscribeToken(token);
  if (!parsed) return null;
  const expected = createNewsletterUnsubscribeToken(parsed.subscriptionId, email);
  const actualBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return null;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer) ? parsed.subscriptionId : null;
}

export function getRequestIp(req: IncomingMessage) {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return String(forwardedValue || req.socket.remoteAddress || "")
    .split(",")[0]
    .trim()
    .slice(0, 128);
}

export function getRequestUserAgent(req: IncomingMessage) {
  return String(req.headers["user-agent"] || "").slice(0, 1000);
}

export function getNewsletterBaseUrl(req: IncomingMessage) {
  const configured = String(process.env.NEWSLETTER_PUBLIC_URL || "").trim().replace(/\/$/, "");
  if (configured) return configured;

  const forwardedHost = req.headers["x-forwarded-host"];
  const rawHost = String(
    (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) || req.headers.host || "",
  ).trim();
  const hostname = rawHost.split(":")[0].toLowerCase();
  const allowed =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "onesta.com.pl" ||
    hostname === "www.onesta.com.pl";
  if (!allowed) throw new Error("Nieprawidłowy host dla linku potwierdzającego.");

  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol =
    String(Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || "") ||
    (hostname === "localhost" || hostname === "127.0.0.1" ? "http" : "https");
  return `${protocol}://${rawHost}`;
}

export function maskNewsletterEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local.slice(0, 2)}${"•".repeat(Math.max(2, Math.min(6, local.length - 2)))}@${domain}`;
}

export async function recordNewsletterEvent(input: {
  subscriptionId?: string | null;
  email: string;
  eventType: string;
  tokenHash?: string;
  providerMessageId?: string | null;
  requestMethod?: string;
  ip?: string;
  userAgent?: string;
  payload?: Record<string, unknown>;
  occurredAt?: string;
}) {
  if (!supabaseServer) throw new Error("Brak konfiguracji Supabase po stronie serwera.");
  const occurredAt = input.occurredAt || new Date().toISOString();
  let sequenceNumber: number | null = null;
  let previousEventHash = "";
  if (input.subscriptionId) {
    const { data: previous, error: previousError } = await supabaseServer
      .from("newsletter_consent_events")
      .select("sequence_number,event_hash")
      .eq("subscription_id", input.subscriptionId)
      .not("sequence_number", "is", null)
      .order("sequence_number", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (previousError) throw previousError;
    sequenceNumber = Number(previous?.sequence_number || 0) + 1;
    previousEventHash = String(previous?.event_hash || "");
  }
  const eventForHash = {
    subscriptionId: input.subscriptionId || null,
    email: input.email,
    eventType: input.eventType,
    tokenHash: input.tokenHash || "",
    providerMessageId: input.providerMessageId || null,
    requestMethod: input.requestMethod || "",
    ip: input.ip || "",
    userAgent: input.userAgent || "",
    payload: input.payload || {},
    occurredAt,
    sequenceNumber,
    previousEventHash,
  };
  const eventHash = sha256(stableCanonicalJson(eventForHash));
  const { error } = await supabaseServer.from("newsletter_consent_events").insert({
    subscription_id: input.subscriptionId || null,
    email: input.email,
    event_type: input.eventType,
    token_hash: input.tokenHash || "",
    provider_message_id: input.providerMessageId || null,
    request_method: input.requestMethod || "",
    ip: input.ip || "",
    user_agent: input.userAgent || "",
    payload: input.payload || {},
    sequence_number: sequenceNumber,
    previous_event_hash: previousEventHash,
    event_hash: eventHash,
    occurred_at: occurredAt,
  });
  if (error) throw error;
  return { sequenceNumber, previousEventHash, eventHash, occurredAt };
}

export async function createNewsletterEvidencePackage(
  subscriptionId: string,
  packageType: "consent_confirmed" | "consent_withdrawn",
) {
  if (!supabaseServer) throw new Error("Brak konfiguracji Supabase po stronie serwera.");
  const { data: subscription, error: subscriptionError } = await supabaseServer
    .from("newsletter_subscriptions")
    .select("*")
    .eq("id", subscriptionId)
    .single();
  if (subscriptionError) throw subscriptionError;
  const { data: events, error: eventsError } = await supabaseServer
    .from("newsletter_consent_events")
    .select(
      "email,event_type,token_hash,provider_message_id,request_method,ip,user_agent,payload,sequence_number,previous_event_hash,event_hash,occurred_at",
    )
    .eq("subscription_id", subscriptionId)
    .order("occurred_at", { ascending: true });
  if (eventsError) throw eventsError;
  const { data: previousPackage, error: packageLookupError } = await supabaseServer
    .from("newsletter_evidence_packages")
    .select("payload_hash")
    .eq("subscription_id", subscriptionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (packageLookupError) throw packageLookupError;

  const generatedAt = new Date().toISOString();
  const payload = {
    schema: NEWSLETTER_EVIDENCE_VERSION,
    packageType,
    generatedAt,
    administrator: {
      name: "Onesta Group Sp. z o.o.",
      privacyPolicyUrl: "https://onesta.com.pl/polityka-prywatnosci",
    },
    subscription: {
      id: subscription.id,
      email: subscription.email_normalized,
      name: subscription.name,
      status: subscription.status,
      sourceUrl: subscription.source_url,
      requestedAt: subscription.requested_at,
      requestIp: subscription.request_ip,
      requestUserAgent: subscription.request_user_agent,
      confirmedAt: subscription.confirmed_at,
      confirmationIp: subscription.confirmation_ip,
      confirmationUserAgent: subscription.confirmation_user_agent,
      unsubscribedAt: subscription.unsubscribed_at,
      initiationType: subscription.initiation_type,
      invitationRequestedBy: subscription.invitation_requested_by,
      invitationContext: subscription.invitation_context,
      invitationConversationAt: subscription.invitation_conversation_at,
    },
    consent: {
      purpose: "Newsletter oraz informacje handlowe i marketingowe Onesta",
      channel: "email",
      version: subscription.consent_version,
      text: subscription.consent_text,
      textHash: subscription.consent_text_hash,
    },
    confirmationEmail: {
      provider: subscription.confirmation_email_provider,
      providerStatus: subscription.confirmation_email_provider_status,
      messageId: subscription.confirmation_email_message_id,
      smtpResponse: subscription.confirmation_email_smtp_response,
      accepted: subscription.confirmation_email_accepted,
      rejected: subscription.confirmation_email_rejected,
      envelope: subscription.confirmation_email_envelope,
      subject: subscription.confirmation_email_subject,
      contentHash: subscription.confirmation_email_content_hash,
      templateVersion: subscription.confirmation_email_template_version,
      sentAt: subscription.confirmation_sent_at,
      deliveredAt: subscription.confirmation_email_delivered_at,
      archivedContent: decryptNewsletterArchive(subscription.confirmation_email_archive),
    },
    eventTrail: (events || []).map((event) => ({
      sequenceNumber: event.sequence_number,
      previousEventHash: event.previous_event_hash,
      eventHash: event.event_hash,
      eventType: event.event_type,
      occurredAt: event.occurred_at,
      requestMethod: event.request_method,
      ip: event.ip,
      userAgent: event.user_agent,
      providerMessageId: event.provider_message_id,
      tokenHash: event.token_hash,
      payload: event.payload,
    })),
  };
  const payloadHash = sha256(stableCanonicalJson(payload));
  const payloadSignature = signNewsletterEvidenceHash(payloadHash);
  const { data: evidence, error: evidenceError } = await supabaseServer
    .from("newsletter_evidence_packages")
    .insert({
      subscription_id: subscriptionId,
      package_type: packageType,
      package_version: NEWSLETTER_EVIDENCE_VERSION,
      canonical_payload: payload,
      payload_hash: payloadHash,
      payload_signature: payloadSignature,
      signature_key_id: "onesta-evidence-v1",
      previous_package_hash: String(previousPackage?.payload_hash || ""),
    })
    .select("id,subscription_id,package_type,package_version,payload_hash,payload_signature,signature_key_id,previous_package_hash,created_at")
    .single();
  if (evidenceError) throw evidenceError;
  return evidence;
}

export function verifyNewsletterEvidencePayload(payload: unknown, expectedHash: string) {
  return sha256(stableCanonicalJson(payload)) === expectedHash;
}

export async function withdrawNewsletterSubscription(input: {
  subscriptionId: string;
  email: string;
  source: string;
  occurredAt?: string;
  requestMethod?: string;
  ip?: string;
  userAgent?: string;
  tokenHash?: string;
  providerMessageId?: string | null;
  payload?: Record<string, unknown>;
}) {
  if (!supabaseServer) throw new Error("Brak konfiguracji Supabase po stronie serwera.");
  const email = normalizeNewsletterEmail(input.email);
  const occurredAt = input.occurredAt || new Date().toISOString();
  const { data: subscription, error: lookupError } = await supabaseServer
    .from("newsletter_subscriptions")
    .select("id,status,email_normalized")
    .eq("id", input.subscriptionId)
    .single();
  if (lookupError) throw lookupError;
  if (normalizeNewsletterEmail(subscription.email_normalized) !== email) {
    throw new Error("Adres nie pasuje do subskrypcji.");
  }

  let changed = false;
  if (subscription.status !== "unsubscribed") {
    const { data: updated, error: updateError } = await supabaseServer
      .from("newsletter_subscriptions")
      .update({ status: "unsubscribed", unsubscribed_at: occurredAt, updated_at: occurredAt })
      .eq("id", input.subscriptionId)
      .neq("status", "unsubscribed")
      .select("id")
      .maybeSingle();
    if (updateError) throw updateError;
    changed = Boolean(updated);
  }

  let evidence: any = null;
  if (changed) {
    await recordNewsletterEvent({
      subscriptionId: input.subscriptionId,
      email,
      eventType: "consent_withdrawn",
      tokenHash: input.tokenHash,
      providerMessageId: input.providerMessageId,
      requestMethod: input.requestMethod || "",
      ip: input.ip || "",
      userAgent: input.userAgent || "",
      occurredAt,
      payload: { source: input.source, ...(input.payload || {}) },
    });
    evidence = await createNewsletterEvidencePackage(input.subscriptionId, "consent_withdrawn");
  }

  const { data: contacts, error: crmError } = await supabaseServer
    .from("crm_contacts")
    .update({
      marketing_email_status: "unsubscribed",
      marketing_unsubscribed_at: occurredAt,
      marketing_consent_source: input.source,
    })
    .ilike("email", email)
    .select("id");
  if (crmError) throw crmError;

  return {
    changed,
    evidence,
    contactIds: (contacts || []).map((contact) => contact.id),
  };
}

export function newsletterSchemaErrorMessage(error: { message?: string; code?: string }) {
  const message = String(error?.message || "Nieznany błąd bazy danych.");
  if (
    message.includes("newsletter_subscriptions") ||
    message.includes("newsletter_consent_events") ||
    message.includes("newsletter_evidence_packages") ||
    message.includes("Could not find the table") ||
    error?.code === "42P01"
  ) {
    return "Brak tabel double opt-in. Uruchom scripts/newsletter_double_opt_in_schema.sql w Supabase SQL Editor.";
  }
  return message;
}
