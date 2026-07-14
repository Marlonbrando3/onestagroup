import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import {
  createNewsletterEvidencePackage,
  getRequestIp,
  getRequestUserAgent,
  newsletterSchemaErrorMessage,
  normalizeNewsletterEmail,
  recordNewsletterEvent,
  sha256,
} from "@/lib/newsletterDoubleOptIn";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!supabaseServer) {
    return res.status(500).json({ error: "Brak konfiguracji Supabase po stronie serwera." });
  }

  const token = String(req.body?.token || "").trim();
  const consentAccepted = req.body?.consentAccepted === true;
  if (!token || token.length > 200) {
    return res.status(400).json({ error: "Nieprawidłowy token potwierdzający." });
  }
  const tokenHash = sha256(token);
  const ip = getRequestIp(req);
  const userAgent = getRequestUserAgent(req);

  try {
    const { data: subscription, error } = await supabaseServer
      .from("newsletter_subscriptions")
      .select("*")
      .eq("token_hash", tokenHash)
      .maybeSingle();
    if (error) throw error;
    if (!subscription) return res.status(404).json({ error: "Link jest nieprawidłowy." });
    if (subscription.initiation_type === "crm_phone_request" && !consentAccepted) {
      return res.status(400).json({ error: "Zaznacz zgodę, aby potwierdzić zapis." });
    }
    if (subscription.status === "confirmed") {
      return res.status(200).json({ confirmed: true, alreadyConfirmed: true });
    }
    if (subscription.status !== "pending") {
      return res.status(409).json({ error: "Ta subskrypcja nie oczekuje na potwierdzenie." });
    }
    if (new Date(subscription.token_expires_at).getTime() < Date.now()) {
      return res.status(410).json({ error: "Link potwierdzający wygasł. Zapisz się ponownie." });
    }
    if (!subscription.confirmation_sent_at || !subscription.confirmation_email_message_id) {
      return res.status(409).json({ error: "Brak potwierdzonego zdarzenia wysyłki wiadomości." });
    }

    const confirmedAt = new Date().toISOString();
    const { data: confirmed, error: confirmError } = await supabaseServer
      .from("newsletter_subscriptions")
      .update({
        status: "confirmed",
        confirmed_at: confirmedAt,
        confirmation_ip: ip,
        confirmation_user_agent: userAgent,
        updated_at: confirmedAt,
      })
      .eq("id", subscription.id)
      .eq("status", "pending")
      .eq("token_hash", tokenHash)
      .select("id")
      .maybeSingle();
    if (confirmError) throw confirmError;
    if (!confirmed) return res.status(409).json({ error: "Link został już wykorzystany." });

    await recordNewsletterEvent({
      subscriptionId: subscription.id,
      email: subscription.email_normalized,
      eventType: "consent_confirmed",
      tokenHash,
      providerMessageId: subscription.confirmation_email_message_id,
      requestMethod: "POST",
      ip,
      userAgent,
      occurredAt: confirmedAt,
      payload: {
        previousStatus: "pending",
        newStatus: "confirmed",
        consentVersion: subscription.consent_version,
        consentText: subscription.consent_text,
        consentTextHash: subscription.consent_text_hash,
        confirmationSentAt: subscription.confirmation_sent_at,
        initiationType: subscription.initiation_type,
        explicitConsentCheckboxAccepted: consentAccepted,
      },
    });

    const evidence = await createNewsletterEvidencePackage(subscription.id, "consent_confirmed");

    const email = normalizeNewsletterEmail(subscription.email_normalized);
    const { data: contacts, error: contactLookupError } = await supabaseServer
      .from("crm_contacts")
      .select("id")
      .ilike("email", email)
      .limit(20);
    if (contactLookupError) throw contactLookupError;
    let contactIds = (contacts || []).map((contact) => contact.id);
    if (contactIds.length) {
      const { error: contactUpdateError } = await supabaseServer
        .from("crm_contacts")
        .update({
          marketing_email_status: "consented",
          marketing_consent_at: confirmedAt,
          marketing_consent_source: `newsletter-double-opt-in:${subscription.id}`,
          marketing_consent_evidence_id: evidence.id,
          marketing_unsubscribed_at: null,
        })
        .in("id", contactIds);
      if (contactUpdateError) throw contactUpdateError;
    } else {
      const { data: contact, error: contactInsertError } = await supabaseServer
        .from("crm_contacts")
        .insert({
          name: subscription.name || email,
          email,
          source: "Newsletter double opt-in",
          marketing_email_status: "consented",
          marketing_consent_at: confirmedAt,
          marketing_consent_source: `newsletter-double-opt-in:${subscription.id}`,
          marketing_consent_evidence_id: evidence.id,
          marketing_unsubscribed_at: null,
        })
        .select("id")
        .single();
      if (contactInsertError) throw contactInsertError;
      contactIds = [contact.id];
    }

    await recordNewsletterEvent({
      subscriptionId: subscription.id,
      email,
      eventType: "crm_contact_marketing_consent_synced",
      tokenHash,
      occurredAt: new Date().toISOString(),
      payload: {
        contactIds,
        marketingEmailStatus: "consented",
        evidencePackageId: evidence.id,
        evidencePayloadHash: evidence.payload_hash,
      },
    });

    return res.status(200).json({ confirmed: true });
  } catch (error: any) {
    console.error("Newsletter confirmation error:", error);
    return res.status(500).json({ error: newsletterSchemaErrorMessage(error) });
  }
}
