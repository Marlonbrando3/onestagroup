import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook } from "svix";
import { supabaseServer } from "@/lib/supabaseClient";
import { recordNewsletterEvent, withdrawNewsletterSubscription } from "@/lib/newsletterDoubleOptIn";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResendWebhookEvent = {
  type: string;
  created_at?: string;
  data?: {
    id?: string;
    email?: string;
    to?: string[];
    email_id?: string;
    broadcast_id?: string;
    unsubscribed?: boolean;
    [key: string]: unknown;
  };
};

async function readRawBody(req: NextApiRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function recipientStatus(type: string) {
  const statuses: Record<string, string> = {
    "email.scheduled": "scheduled",
    "email.sent": "sent",
    "email.delivered": "delivered",
    "email.delivery_delayed": "delayed",
    "email.opened": "opened",
    "email.clicked": "clicked",
    "email.bounced": "bounced",
    "email.complained": "complained",
    "email.failed": "failed",
    "email.suppressed": "suppressed",
  };
  return statuses[type] || type;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!supabaseServer) return res.status(500).json({ error: "Brak konfiguracji Supabase." });
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return res.status(500).json({ error: "Brak RESEND_WEBHOOK_SECRET." });

  const id = String(req.headers["svix-id"] || "");
  const timestamp = String(req.headers["svix-timestamp"] || "");
  const signature = String(req.headers["svix-signature"] || "");
  if (!id || !timestamp || !signature) {
    return res.status(400).json({ error: "Brak podpisu webhooka." });
  }

  let event: ResendWebhookEvent;
  try {
    const payload = await readRawBody(req);
    event = new Webhook(secret).verify(payload, {
      "svix-id": id,
      "svix-timestamp": timestamp,
      "svix-signature": signature,
    }) as ResendWebhookEvent;
  } catch {
    return res.status(400).json({ error: "Nieprawidłowy podpis webhooka." });
  }

  const data = event.data || {};
  const email = String(data.email || data.to?.[0] || "").trim().toLowerCase();
  const broadcastId = String(data.broadcast_id || "");
  const providerMessageId = String(data.email_id || "");
  let campaignId: string | null = null;

  const { data: processedEvent } = await supabaseServer
    .from("crm_mailing_events")
    .select("id")
    .eq("provider_event_id", id)
    .maybeSingle();
  if (processedEvent) return res.status(200).json({ received: true, duplicate: true });

  if (broadcastId) {
    const { data: campaign } = await supabaseServer
      .from("crm_mailing_campaigns")
      .select("id")
      .eq("resend_broadcast_id", broadcastId)
      .maybeSingle();
    campaignId = campaign?.id || null;
  }

  if (event.type === "contact.updated" && email && data.unsubscribed === true) {
    const { data: subscription } = await supabaseServer
      .from("newsletter_subscriptions")
      .select("id,email_normalized")
      .eq("email_normalized", email)
      .maybeSingle();
    if (subscription) {
      await withdrawNewsletterSubscription({
        subscriptionId: subscription.id,
        email: subscription.email_normalized,
        source: "Resend — link wypisania",
        occurredAt: event.created_at || new Date().toISOString(),
        providerMessageId,
        payload: { providerEventId: id, providerEventType: event.type },
      });
    } else {
      await supabaseServer
        .from("crm_contacts")
        .update({
          marketing_email_status: "unsubscribed",
          marketing_unsubscribed_at: event.created_at || new Date().toISOString(),
          marketing_consent_source: "Resend — link wypisania",
        })
        .ilike("email", email);
    }
  }

  if (providerMessageId && event.type.startsWith("email.")) {
    const { data: confirmationSubscription } = await supabaseServer
      .from("newsletter_subscriptions")
      .select("id,email_normalized")
      .eq("confirmation_email_message_id", providerMessageId)
      .maybeSingle();
    if (confirmationSubscription) {
      const providerStatus = recipientStatus(event.type);
      const subscriptionPatch: Record<string, string> = {
        confirmation_email_provider_status: providerStatus,
        updated_at: new Date().toISOString(),
      };
      if (event.type === "email.delivered") {
        subscriptionPatch.confirmation_email_delivered_at = event.created_at || new Date().toISOString();
      }
      await supabaseServer
        .from("newsletter_subscriptions")
        .update(subscriptionPatch)
        .eq("id", confirmationSubscription.id);
      await recordNewsletterEvent({
        subscriptionId: confirmationSubscription.id,
        email: confirmationSubscription.email_normalized,
        eventType: `confirmation_email_provider_${providerStatus}`,
        providerMessageId,
        occurredAt: event.created_at || new Date().toISOString(),
        payload: { provider: "resend", providerEventId: id, providerEventType: event.type },
      });
    }
  }

  if (email && ["email.bounced", "email.complained", "email.suppressed"].includes(event.type)) {
    const deliverability = event.type.replace("email.", "");
    const contactPatch: Record<string, string> = { email_deliverability_status: deliverability };
    if (event.type === "email.complained" || event.type === "email.suppressed") {
      contactPatch.marketing_email_status = "blocked";
    }
    await supabaseServer.from("crm_contacts").update(contactPatch).ilike("email", email);
  }

  if (campaignId && email) {
    await supabaseServer
      .from("crm_mailing_recipients")
      .update({
        status: recipientStatus(event.type),
        last_event: event.type,
        provider_message_id: providerMessageId || null,
        updated_at: new Date().toISOString(),
      })
      .eq("campaign_id", campaignId)
      .ilike("email", email);
  }

  if (campaignId && event.type === "email.sent") {
    await supabaseServer
      .from("crm_mailing_campaigns")
      .update({ status: "sent", sent_at: event.created_at || new Date().toISOString() })
      .eq("id", campaignId)
      .eq("status", "scheduled");
  }

  const { error: eventError } = await supabaseServer.from("crm_mailing_events").upsert(
    {
      provider_event_id: id,
      campaign_id: campaignId,
      email,
      event_type: event.type,
      payload: event,
      occurred_at: event.created_at || null,
    },
    { onConflict: "provider_event_id", ignoreDuplicates: true },
  );
  if (eventError) return res.status(500).json({ error: eventError.message });
  return res.status(200).json({ received: true });
}
