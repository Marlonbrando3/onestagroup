import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { sendNewsletterConfirmationEmail } from "@/lib/newsletterConfirmationEmail";
import {
  createConfirmationToken,
  createNewsletterUnsubscribeToken,
  getNewsletterBaseUrl,
  getRequestIp,
  getRequestUserAgent,
  isNewsletterEmail,
  isNewsletterTestRecipient,
  NEWSLETTER_CONSENT_TEXT,
  NEWSLETTER_CONSENT_VERSION,
  NEWSLETTER_TEST_RECIPIENT,
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

  const email = normalizeNewsletterEmail(req.body?.email);
  const name = String(req.body?.name || "").trim().slice(0, 160);
  const consentAccepted = req.body?.consentAccepted === true;
  const sourceUrl = String(req.body?.sourceUrl || "").trim().slice(0, 2000);
  if (!name || !isNewsletterEmail(email) || !consentAccepted) {
    return res.status(400).json({ error: "Podaj imię, poprawny adres e-mail i zaznacz zgodę." });
  }
  const publicSignupEnabled = process.env.NEWSLETTER_PUBLIC_SIGNUP_ENABLED === "true";
  const testRecipient = normalizeNewsletterEmail(
    process.env.NEWSLETTER_TEST_RECIPIENT || NEWSLETTER_TEST_RECIPIENT,
  );
  if (!publicSignupEnabled && !isNewsletterTestRecipient(email, testRecipient)) {
    return res.status(403).json({
      error: "Zapisy do newslettera są obecnie w trybie testowym.",
    });
  }

  const token = createConfirmationToken();
  const tokenHash = sha256(token);
  const now = new Date();
  const nowIso = now.toISOString();
  const tokenExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const requestIp = getRequestIp(req);
  const requestUserAgent = getRequestUserAgent(req);
  const consentTextHash = sha256(NEWSLETTER_CONSENT_TEXT);

  try {
    const { data: existing, error: existingError } = await supabaseServer
      .from("newsletter_subscriptions")
      .select("id,status")
      .eq("email_normalized", email)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing?.status === "confirmed") {
      return res.status(200).json({
        pending: false,
        alreadyConfirmed: true,
        message: "Ten adres ma już potwierdzony zapis do newslettera.",
      });
    }

    const subscriptionValues = {
      email,
      email_normalized: email,
      name,
      status: "pending",
      token_hash: tokenHash,
      token_expires_at: tokenExpiresAt,
      consent_version: NEWSLETTER_CONSENT_VERSION,
      consent_text: NEWSLETTER_CONSENT_TEXT,
      consent_text_hash: consentTextHash,
      source_url: sourceUrl,
      requested_at: nowIso,
      request_ip: requestIp,
      request_user_agent: requestUserAgent,
      confirmation_sent_at: null,
      confirmation_email_message_id: null,
      confirmation_email_smtp_response: null,
      confirmation_email_accepted: [],
      confirmation_email_rejected: [],
      confirmation_email_envelope: {},
      confirmation_email_content_hash: null,
      confirmation_email_template_version: null,
      confirmation_email_provider: "smtp",
      confirmation_email_provider_status: "",
      confirmation_email_delivered_at: null,
      confirmation_email_subject: "",
      confirmation_email_archive: {},
      unsubscribe_token_hash: null,
      confirmed_at: null,
      confirmation_ip: "",
      confirmation_user_agent: "",
      unsubscribed_at: null,
      initiation_type: "website_form",
      invitation_requested_by: "",
      invitation_context: "",
      invitation_conversation_at: null,
      updated_at: nowIso,
    };

    const subscriptionQuery = existing
      ? supabaseServer
          .from("newsletter_subscriptions")
          .update(subscriptionValues)
          .eq("id", existing.id)
          .select("id")
          .single()
      : supabaseServer
          .from("newsletter_subscriptions")
          .insert(subscriptionValues)
          .select("id")
          .single();
    const { data: subscription, error: subscriptionError } = await subscriptionQuery;
    if (subscriptionError || !subscription) throw subscriptionError || new Error("Brak subskrypcji.");

    await recordNewsletterEvent({
      subscriptionId: subscription.id,
      email,
      eventType: "subscription_requested",
      tokenHash,
      requestMethod: "POST",
      ip: requestIp,
      userAgent: requestUserAgent,
      occurredAt: nowIso,
      payload: {
        consentVersion: NEWSLETTER_CONSENT_VERSION,
        consentText: NEWSLETTER_CONSENT_TEXT,
        consentTextHash,
        sourceUrl,
        tokenExpiresAt,
        applicationVersion: process.env.VERCEL_GIT_COMMIT_SHA || "local",
      },
    });

    const baseUrl = getNewsletterBaseUrl(req);
    const unsubscribeToken = createNewsletterUnsubscribeToken(subscription.id, email);
    let emailEvidence;
    try {
      emailEvidence = await sendNewsletterConfirmationEmail({
        subscriptionId: subscription.id,
        email,
        name,
        token,
        baseUrl,
      });
    } catch (error: any) {
      await recordNewsletterEvent({
        subscriptionId: subscription.id,
        email,
        eventType: "confirmation_email_failed",
        tokenHash,
        occurredAt: new Date().toISOString(),
        payload: { error: String(error?.message || "Błąd SMTP").slice(0, 1000) },
      });
      throw error;
    }

    const smtpEvidence = {
      confirmation_sent_at: emailEvidence.sentAt,
      confirmation_email_message_id: emailEvidence.messageId,
      confirmation_email_smtp_response: emailEvidence.smtpResponse,
      confirmation_email_accepted: emailEvidence.accepted,
      confirmation_email_rejected: emailEvidence.rejected,
      confirmation_email_envelope: emailEvidence.envelope,
      confirmation_email_content_hash: emailEvidence.emailContentHash,
      confirmation_email_template_version: emailEvidence.templateVersion,
      confirmation_email_provider: "smtp",
      confirmation_email_provider_status: "accepted",
      confirmation_email_subject: emailEvidence.subject,
      confirmation_email_archive: emailEvidence.archive,
      unsubscribe_token_hash: sha256(unsubscribeToken),
      updated_at: emailEvidence.sentAt,
    };
    const { error: sentUpdateError } = await supabaseServer
      .from("newsletter_subscriptions")
      .update(smtpEvidence)
      .eq("id", subscription.id)
      .eq("token_hash", tokenHash);
    if (sentUpdateError) throw sentUpdateError;

    await recordNewsletterEvent({
      subscriptionId: subscription.id,
      email,
      eventType: "confirmation_email_accepted_by_smtp",
      tokenHash,
      providerMessageId: emailEvidence.messageId,
      occurredAt: emailEvidence.sentAt,
      payload: {
        accepted: emailEvidence.accepted,
        rejected: emailEvidence.rejected,
        envelope: emailEvidence.envelope,
        smtpResponse: emailEvidence.smtpResponse,
        emailContentHash: emailEvidence.emailContentHash,
        emailTemplateVersion: emailEvidence.templateVersion,
        confirmationUrlBase: `${baseUrl}/newsletter/potwierdz`,
      },
    });

    return res.status(200).json({
      pending: true,
      message: "Wysłaliśmy wiadomość z linkiem potwierdzającym. Sprawdź skrzynkę e-mail.",
    });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return res.status(500).json({ error: newsletterSchemaErrorMessage(error) });
  }
}
