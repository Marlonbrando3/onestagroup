import type { NextApiRequest, NextApiResponse } from "next";
import type { MarketingEmailStatus } from "@/components/crm/mailingTypes";
import { getCrmUser } from "@/components/crm/users";
import {
  handleMailingDatabaseError,
  requireCrmAdmin,
} from "@/lib/crmMailingServer";
import { supabaseServer } from "@/lib/supabaseClient";
import {
  getRequestIp,
  getRequestUserAgent,
  normalizeNewsletterEmail,
  withdrawNewsletterSubscription,
} from "@/lib/newsletterDoubleOptIn";

const allowedStatuses: MarketingEmailStatus[] = ["unsubscribed"];

function mapContact(row: any, subscription?: any, pipelineName?: string) {
  const ownerEmail = String(row.pipeline_owner || "").trim().toLowerCase();
  return {
    id: row.id,
    name: row.name || "",
    email: row.email || "",
    phone: row.phone || "",
    status: row.status || "",
    pipelineId: row.pipeline_id || null,
    pipelineName: row.pipeline_id ? pipelineName || "Nieznany lejek" : "Lejek podstawowy",
    ownerEmail,
    ownerName: getCrmUser(ownerEmail)?.label || row.owner || ownerEmail || "Nieprzypisany",
    marketingEmailStatus: row.marketing_email_status || "unknown",
    marketingConsentAt: row.marketing_consent_at || null,
    marketingConsentSource: row.marketing_consent_source || "",
    marketingUnsubscribedAt: row.marketing_unsubscribed_at || null,
    marketingConsentEvidenceId: row.marketing_consent_evidence_id || null,
    emailDeliverabilityStatus: row.email_deliverability_status || "unknown",
    consentRequestStatus:
      subscription?.status === "pending" && subscription?.initiation_type === "crm_phone_request"
        ? "pending"
        : null,
    consentRequestSentAt: subscription?.confirmation_sent_at || null,
    consentRequestExpiresAt: subscription?.token_expires_at || null,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireCrmAdmin(req, res);
  if (!admin || !supabaseServer) return;

  if (req.method === "GET") {
    const rows: any[] = [];
    const pageSize = 1000;
    for (let from = 0; from < 100000; from += pageSize) {
      const { data, error } = await supabaseServer
        .from("crm_contacts")
        .select(
          "id,name,email,phone,owner,status,pipeline_id,pipeline_owner,marketing_email_status,marketing_consent_at,marketing_consent_source,marketing_unsubscribed_at,marketing_consent_evidence_id,email_deliverability_status",
        )
        .order("name", { ascending: true })
        .range(from, from + pageSize - 1);
      if (error) return handleMailingDatabaseError(res, error);
      rows.push(...(data || []));
      if ((data || []).length < pageSize) break;
    }
    const subscriptions: any[] = [];
    for (let from = 0; from < 100000; from += pageSize) {
      const { data, error } = await supabaseServer
        .from("newsletter_subscriptions")
        .select("email_normalized,status,initiation_type,confirmation_sent_at,token_expires_at")
        .range(from, from + pageSize - 1);
      if (error) return handleMailingDatabaseError(res, error);
      subscriptions.push(...(data || []));
      if ((data || []).length < pageSize) break;
    }
    const subscriptionByEmail = new Map(
      subscriptions.map((subscription) => [subscription.email_normalized, subscription]),
    );
    const { data: pipelines, error: pipelinesError } = await supabaseServer
      .from("crm_pipelines")
      .select("id,name");
    if (pipelinesError) return handleMailingDatabaseError(res, pipelinesError);
    const pipelineNameById = new Map((pipelines || []).map((pipeline) => [pipeline.id, pipeline.name]));
    return res.status(200).json({
      contacts: rows.map((row) =>
        mapContact(
          row,
          subscriptionByEmail.get(String(row.email || "").trim().toLowerCase()),
          pipelineNameById.get(row.pipeline_id),
        ),
      ),
    });
  }

  if (req.method === "PATCH") {
    const status = String(req.body?.marketingEmailStatus || "") as MarketingEmailStatus;
    const ids = Array.from(
      new Set(
        (Array.isArray(req.body?.ids) ? req.body.ids : [req.body?.id])
          .map((id: unknown) => String(id || ""))
          .filter(Boolean),
      ),
    ).slice(0, 10000);
    if (ids.length !== 1 || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Wycofanie zgody jest możliwe wyłącznie dla jednego, wskazanego kontaktu.",
      });
    }

    const confirmationEmail = normalizeNewsletterEmail(req.body?.confirmationEmail);
    const { data: contact, error: contactError } = await supabaseServer
      .from("crm_contacts")
      .select(
        "id,name,email,phone,owner,status,pipeline_id,pipeline_owner,marketing_email_status,marketing_consent_at,marketing_consent_source,marketing_unsubscribed_at,marketing_consent_evidence_id,email_deliverability_status",
      )
      .eq("id", ids[0])
      .single();
    if (contactError) return handleMailingDatabaseError(res, contactError);
    const contactEmail = normalizeNewsletterEmail(contact.email);
    if (!confirmationEmail || confirmationEmail !== contactEmail) {
      return res.status(400).json({
        error: "Wpisany adres e-mail nie jest identyczny z adresem wybranego kontaktu.",
      });
    }
    if (contact.marketing_email_status !== "consented") {
      return res.status(409).json({ error: "Ten kontakt nie ma aktywnej zgody do wycofania." });
    }

    const { data: subscription, error: subscriptionError } = await supabaseServer
      .from("newsletter_subscriptions")
      .select("id,email_normalized")
      .eq("email_normalized", contactEmail)
      .maybeSingle();
    if (subscriptionError) return handleMailingDatabaseError(res, subscriptionError);
    if (!subscription) {
      return res.status(409).json({
        error: "Brak powiązanego rejestru zgody. Wycofanie nie zostało wykonane.",
      });
    }

    await withdrawNewsletterSubscription({
      subscriptionId: subscription.id,
      email: subscription.email_normalized,
      source: `CRM — ręczne wycofanie przez ${admin.email}`,
      requestMethod: "PATCH",
      ip: getRequestIp(req),
      userAgent: getRequestUserAgent(req),
      payload: {
        crmContactId: contact.id,
        withdrawnBy: admin.email,
        fullEmailReenteredAndMatched: true,
      },
    });

    const { data: updated, error: updatedError } = await supabaseServer
      .from("crm_contacts")
      .select(
        "id,name,email,phone,owner,status,pipeline_id,pipeline_owner,marketing_email_status,marketing_consent_at,marketing_consent_source,marketing_unsubscribed_at,marketing_consent_evidence_id,email_deliverability_status",
      )
      .eq("id", contact.id)
      .single();
    if (updatedError) return handleMailingDatabaseError(res, updatedError);
    let updatedPipelineName: string | undefined;
    if (updated.pipeline_id) {
      const { data: pipeline, error: pipelineError } = await supabaseServer
        .from("crm_pipelines")
        .select("name")
        .eq("id", updated.pipeline_id)
        .maybeSingle();
      if (pipelineError) return handleMailingDatabaseError(res, pipelineError);
      updatedPipelineName = pipeline?.name;
    }
    return res.status(200).json({ contacts: [mapContact(updated, undefined, updatedPipelineName)] });
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).json({ error: "Method not allowed" });
}
