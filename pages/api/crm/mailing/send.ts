import type { NextApiRequest, NextApiResponse } from "next";
import {
  csvCell,
  getMailingSender,
  handleMailingDatabaseError,
  requireCrmAdmin,
  resendJson,
  splitContactName,
} from "@/lib/crmMailingServer";
import { supabaseServer } from "@/lib/supabaseClient";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function chunks<T>(items: T[], size = 500) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireCrmAdmin(req, res);
  if (!admin || !supabaseServer) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const campaignId = String(req.body?.campaignId || "");
  if (!campaignId) return res.status(400).json({ error: "Brak ID kampanii." });

  const { data: campaign, error: campaignError } = await supabaseServer
    .from("crm_mailing_campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();
  if (campaignError) return handleMailingDatabaseError(res, campaignError);
  if (campaign.status !== "draft") {
    return res.status(409).json({ error: "Tę kampanię już wysłano albo zaplanowano." });
  }
  if (!campaign.group_id || !campaign.subject || !campaign.html_content) {
    return res.status(400).json({ error: "Uzupełnij grupę, temat i treść kampanii." });
  }

  const membershipRows: any[] = [];
  for (let from = 0; from < 100000; from += 1000) {
    const { data, error } = await supabaseServer
      .from("crm_mailing_group_members")
      .select("contact_id")
      .eq("group_id", campaign.group_id)
      .range(from, from + 999);
    if (error) return handleMailingDatabaseError(res, error);
    membershipRows.push(...(data || []));
    if ((data || []).length < 1000) break;
  }
  const contactIds = Array.from(new Set(membershipRows.map((item) => item.contact_id)));
  if (!contactIds.length) return res.status(400).json({ error: "Wybrana grupa jest pusta." });

  const contacts: any[] = [];
  for (const contactIdChunk of chunks(contactIds)) {
    const { data, error } = await supabaseServer
      .from("crm_contacts")
      .select("id,name,email,marketing_email_status,marketing_consent_evidence_id,email_deliverability_status")
      .in("id", contactIdChunk);
    if (error) return handleMailingDatabaseError(res, error);
    contacts.push(...(data || []));
  }

  const evidenceIds = Array.from(
    new Set(contacts.map((contact) => contact.marketing_consent_evidence_id).filter(Boolean)),
  );
  const validEvidenceIds = new Set<string>();
  for (const evidenceIdChunk of chunks(evidenceIds)) {
    const { data, error } = await supabaseServer
      .from("newsletter_evidence_packages")
      .select("id")
      .in("id", evidenceIdChunk)
      .eq("package_type", "consent_confirmed");
    if (error) return handleMailingDatabaseError(res, error);
    (data || []).forEach((item) => validEvidenceIds.add(item.id));
  }

  const eligible = contacts.filter((contact) => {
    const deliverability = String(contact.email_deliverability_status || "unknown");
    return (
      contact.marketing_email_status === "consented" &&
      validEvidenceIds.has(contact.marketing_consent_evidence_id) &&
      isEmail(String(contact.email || "").trim()) &&
      !["blocked", "bounced", "complained"].includes(deliverability)
    );
  });
  if (!eligible.length) {
    return res.status(400).json({
      error: "W grupie nie ma żadnego kontaktu z poprawnym e-mailem i zapisaną zgodą.",
    });
  }

  try {
    const sender = getMailingSender();
    const segment = await resendJson<{ id: string }>("/segments", {
      method: "POST",
      body: JSON.stringify({ name: `Onesta — ${campaign.name} — ${campaign.id.slice(0, 8)}` }),
    });

    const rows = eligible.map((contact) => {
      const { firstName, lastName } = splitContactName(contact.name || "");
      return [contact.email.trim().toLowerCase(), firstName, lastName].map(csvCell).join(",");
    });
    const csv = ["Email,First Name,Last Name", ...rows].join("\n");
    const form = new FormData();
    form.append("file", new Blob([csv], { type: "text/csv" }), `onesta-${campaign.id}.csv`);
    form.append(
      "column_map",
      JSON.stringify({
        email: "Email",
        first_name: "First Name",
        last_name: "Last Name",
      }),
    );
    form.append("on_conflict", "upsert");
    form.append("segments", JSON.stringify([{ id: segment.id }]));
    const contactImport = await resendJson<{ id: string }>("/contacts/imports", {
      method: "POST",
      body: form,
    });

    const earliestSend = new Date(Date.now() + 10 * 60 * 1000);
    const requestedDate = req.body?.scheduledAt ? new Date(String(req.body.scheduledAt)) : null;
    const scheduledAt =
      requestedDate && !Number.isNaN(requestedDate.getTime()) && requestedDate > earliestSend
        ? requestedDate
        : earliestSend;
    const fromName = String(campaign.from_name || sender.name).trim() || sender.name;
    const fromEmail = String(campaign.from_email || sender.email).trim() || sender.email;
    const broadcast = await resendJson<{ id: string }>("/broadcasts", {
      method: "POST",
      body: JSON.stringify({
        segment_id: segment.id,
        name: campaign.name,
        from: `${fromName} <${fromEmail}>`,
        subject: campaign.subject,
        html: campaign.html_content,
        send: true,
        scheduled_at: scheduledAt.toISOString(),
      }),
    });

    const recipientRows = eligible.map((contact) => ({
      campaign_id: campaign.id,
      contact_id: contact.id,
      email: contact.email.trim().toLowerCase(),
      name: contact.name || "",
      status: "scheduled",
      updated_at: new Date().toISOString(),
    }));
    for (const recipientChunk of chunks(recipientRows)) {
      const { error: recipientsError } = await supabaseServer
        .from("crm_mailing_recipients")
        .upsert(recipientChunk, { onConflict: "campaign_id,email" });
      if (recipientsError) return handleMailingDatabaseError(res, recipientsError);
    }

    const { error: updateError } = await supabaseServer
      .from("crm_mailing_campaigns")
      .update({
        status: "scheduled",
        resend_segment_id: segment.id,
        resend_contact_import_id: contactImport.id,
        resend_broadcast_id: broadcast.id,
        scheduled_at: scheduledAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaign.id);
    if (updateError) return handleMailingDatabaseError(res, updateError);

    return res.status(200).json({
      scheduled: true,
      recipientCount: eligible.length,
      skippedCount: contactIds.length - eligible.length,
      scheduledAt: scheduledAt.toISOString(),
      broadcastId: broadcast.id,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Nie udało się zaplanować wysyłki." });
  }
}
