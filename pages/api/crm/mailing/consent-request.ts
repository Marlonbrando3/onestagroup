import type { NextApiRequest, NextApiResponse } from "next";
import { requireCrmAdmin, handleMailingDatabaseError } from "@/lib/crmMailingServer";
import { sendNewsletterConfirmationEmail } from "@/lib/newsletterConfirmationEmail";
import {
  createConfirmationToken,
  createNewsletterUnsubscribeToken,
  getNewsletterBaseUrl,
  getRequestIp,
  getRequestUserAgent,
  isNewsletterEmail,
  NEWSLETTER_CONSENT_TEXT,
  NEWSLETTER_CONSENT_VERSION,
  normalizeNewsletterEmail,
  recordNewsletterEvent,
  sha256,
} from "@/lib/newsletterDoubleOptIn";
import { supabaseServer } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireCrmAdmin(req, res);
  if (!admin || !supabaseServer) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const contactId = String(req.body?.contactId || "").trim();
  const context = String(req.body?.conversationContext || "").trim().slice(0, 2000);
  const phoneAgreementConfirmed = req.body?.phoneAgreementConfirmed === true;
  const conversationAtInput = String(req.body?.conversationAt || "").trim();
  const conversationAt = conversationAtInput ? new Date(conversationAtInput) : new Date();
  if (!contactId || !phoneAgreementConfirmed || context.length < 10) {
    return res.status(400).json({
      error: "Potwierdź prośbę klienta i opisz ustalenie z rozmowy (minimum 10 znaków).",
    });
  }
  if (Number.isNaN(conversationAt.getTime()) || conversationAt.getTime() > Date.now() + 60000) {
    return res.status(400).json({ error: "Nieprawidłowa data rozmowy." });
  }

  try {
    const { data: contact, error: contactError } = await supabaseServer
      .from("crm_contacts")
      .select("id,name,email,marketing_email_status,marketing_consent_evidence_id")
      .eq("id", contactId)
      .single();
    if (contactError) return handleMailingDatabaseError(res, contactError);
    const email = normalizeNewsletterEmail(contact.email);
    const name = String(contact.name || email).trim().slice(0, 160);
    if (!isNewsletterEmail(email)) {
      return res.status(400).json({ error: "Kontakt nie ma poprawnego adresu e-mail." });
    }
    if (contact.marketing_email_status === "consented" && contact.marketing_consent_evidence_id) {
      return res.status(409).json({ error: "Ten kontakt ma już potwierdzoną zgodę." });
    }

    const { data: existing, error: existingError } = await supabaseServer
      .from("newsletter_subscriptions")
      .select("id,status")
      .eq("email_normalized", email)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing?.status === "confirmed") {
      return res.status(409).json({ error: "Ten adres ma już potwierdzoną subskrypcję." });
    }

    const token = createConfirmationToken();
    const tokenHash = sha256(token);
    const now = new Date();
    const nowIso = now.toISOString();
    const tokenExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const consentTextHash = sha256(NEWSLETTER_CONSENT_TEXT);
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
      source_url: `crm://contact/${contact.id}/phone-request`,
      requested_at: nowIso,
      request_ip: getRequestIp(req),
      request_user_agent: getRequestUserAgent(req),
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
      initiation_type: "crm_phone_request",
      invitation_requested_by: admin.email,
      invitation_context: context,
      invitation_conversation_at: conversationAt.toISOString(),
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
      eventType: "consent_invitation_requested_after_phone_conversation",
      tokenHash,
      requestMethod: "POST",
      ip: getRequestIp(req),
      userAgent: getRequestUserAgent(req),
      occurredAt: nowIso,
      payload: {
        crmContactId: contact.id,
        requestedBy: admin.email,
        conversationAt: conversationAt.toISOString(),
        conversationContext: context,
        adminAttestation: true,
        tokenExpiresAt,
      },
    });

    let emailEvidence;
    try {
      emailEvidence = await sendNewsletterConfirmationEmail({
        subscriptionId: subscription.id,
        email,
        name,
        token,
        baseUrl: getNewsletterBaseUrl(req),
        introduction:
          "Zgodnie z ustaleniem podczas rozmowy przesyłamy link, pod którym możesz samodzielnie potwierdzić zapis do newslettera Onesta.",
      });
    } catch (error: any) {
      await recordNewsletterEvent({
        subscriptionId: subscription.id,
        email,
        eventType: "consent_invitation_email_failed",
        tokenHash,
        occurredAt: new Date().toISOString(),
        payload: { error: String(error?.message || "Błąd SMTP").slice(0, 1000) },
      });
      throw error;
    }

    const unsubscribeToken = createNewsletterUnsubscribeToken(subscription.id, email);
    const { error: sentUpdateError } = await supabaseServer
      .from("newsletter_subscriptions")
      .update({
        confirmation_sent_at: emailEvidence.sentAt,
        confirmation_email_message_id: emailEvidence.messageId,
        confirmation_email_smtp_response: emailEvidence.smtpResponse,
        confirmation_email_accepted: emailEvidence.accepted,
        confirmation_email_rejected: emailEvidence.rejected,
        confirmation_email_envelope: emailEvidence.envelope,
        confirmation_email_content_hash: emailEvidence.emailContentHash,
        confirmation_email_template_version: emailEvidence.templateVersion,
        confirmation_email_provider_status: "accepted",
        confirmation_email_subject: emailEvidence.subject,
        confirmation_email_archive: emailEvidence.archive,
        unsubscribe_token_hash: sha256(unsubscribeToken),
        updated_at: emailEvidence.sentAt,
      })
      .eq("id", subscription.id)
      .eq("token_hash", tokenHash);
    if (sentUpdateError) throw sentUpdateError;

    await recordNewsletterEvent({
      subscriptionId: subscription.id,
      email,
      eventType: "consent_invitation_email_accepted_by_smtp",
      tokenHash,
      providerMessageId: emailEvidence.messageId,
      occurredAt: emailEvidence.sentAt,
      payload: {
        crmContactId: contact.id,
        requestedBy: admin.email,
        accepted: emailEvidence.accepted,
        rejected: emailEvidence.rejected,
        smtpResponse: emailEvidence.smtpResponse,
        emailContentHash: emailEvidence.emailContentHash,
        emailTemplateVersion: emailEvidence.templateVersion,
      },
    });

    return res.status(200).json({
      sent: true,
      contactId: contact.id,
      requestedAt: nowIso,
      expiresAt: tokenExpiresAt,
      messageId: emailEvidence.messageId,
    });
  } catch (error: any) {
    return handleMailingDatabaseError(res, error);
  }
}
