import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleMailingDatabaseError,
  normalizeMailingContent,
  renderMailingHtml,
  requireCrmAdmin,
} from "@/lib/crmMailingServer";
import { supabaseServer } from "@/lib/supabaseClient";

function mapCampaign(row: any) {
  return {
    id: row.id,
    name: row.name || "",
    subject: row.subject || "",
    previewText: row.preview_text || "",
    fromName: row.from_name || "Marek z Onesta",
    fromEmail: row.from_email || "",
    replyTo: row.reply_to || "",
    groupId: row.group_id || null,
    content: normalizeMailingContent(row.content),
    htmlContent: row.html_content || "",
    status: row.status || "draft",
    resendBroadcastId: row.resend_broadcast_id || null,
    scheduledAt: row.scheduled_at || null,
    sentAt: row.sent_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireCrmAdmin(req, res);
  if (!admin || !supabaseServer) return;

  if (req.method === "GET") {
    const { data, error } = await supabaseServer
      .from("crm_mailing_campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return handleMailingDatabaseError(res, error);
    return res.status(200).json({ campaigns: (data || []).map(mapCampaign) });
  }

  if (req.method === "POST" || req.method === "PATCH") {
    const id = String(req.body?.id || "");
    const name = String(req.body?.name || "").trim();
    const subject = String(req.body?.subject || "").trim();
    const previewText = String(req.body?.previewText || "").trim();
    const groupId = String(req.body?.groupId || "").trim() || null;
    const content = normalizeMailingContent(req.body?.content);
    if (!name) return res.status(400).json({ error: "Nazwa kampanii jest wymagana." });

    const payload = {
      name,
      subject,
      preview_text: previewText,
      from_name: String(req.body?.fromName || "Marek z Onesta").trim(),
      from_email: String(req.body?.fromEmail || process.env.MAILING_FROM_EMAIL || "").trim(),
      reply_to: String(req.body?.replyTo || process.env.MAILING_REPLY_TO || "").trim(),
      group_id: groupId,
      content,
      html_content: renderMailingHtml(content, previewText),
      updated_at: new Date().toISOString(),
    };

    if (req.method === "POST") {
      const { data, error } = await supabaseServer
        .from("crm_mailing_campaigns")
        .insert({ ...payload, created_by: admin.email, status: "draft" })
        .select("*")
        .single();
      if (error) return handleMailingDatabaseError(res, error);
      return res.status(201).json({ campaign: mapCampaign(data) });
    }

    if (!id) return res.status(400).json({ error: "Brak ID kampanii." });
    const { data, error } = await supabaseServer
      .from("crm_mailing_campaigns")
      .update(payload)
      .eq("id", id)
      .eq("status", "draft")
      .select("*")
      .single();
    if (error) return handleMailingDatabaseError(res, error);
    return res.status(200).json({ campaign: mapCampaign(data) });
  }

  res.setHeader("Allow", "GET, POST, PATCH");
  return res.status(405).json({ error: "Method not allowed" });
}

