import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import {
  getRequestIp,
  getRequestUserAgent,
  newsletterSchemaErrorMessage,
  parseNewsletterUnsubscribeToken,
  sha256,
  verifyNewsletterUnsubscribeToken,
  withdrawNewsletterSubscription,
} from "@/lib/newsletterDoubleOptIn";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!supabaseServer) return res.status(500).json({ error: "Brak konfiguracji Supabase." });

  const token = String(req.body?.token || "").trim();
  const parsed = token.length <= 300 ? parseNewsletterUnsubscribeToken(token) : null;
  if (!parsed) return res.status(400).json({ error: "Nieprawidłowy link wypisania." });

  try {
    const { data: subscription, error } = await supabaseServer
      .from("newsletter_subscriptions")
      .select("id,email_normalized,unsubscribe_token_hash")
      .eq("id", parsed.subscriptionId)
      .maybeSingle();
    if (error) throw error;
    if (
      !subscription ||
      verifyNewsletterUnsubscribeToken(token, subscription.email_normalized) !== subscription.id ||
      (subscription.unsubscribe_token_hash && subscription.unsubscribe_token_hash !== sha256(token))
    ) {
      return res.status(404).json({ error: "Link wypisania jest nieprawidłowy." });
    }

    const result = await withdrawNewsletterSubscription({
      subscriptionId: subscription.id,
      email: subscription.email_normalized,
      source: "Newsletter — własny link wypisania",
      requestMethod: "POST",
      ip: getRequestIp(req),
      userAgent: getRequestUserAgent(req),
      tokenHash: sha256(token),
    });
    return res.status(200).json({ unsubscribed: true, alreadyUnsubscribed: !result.changed });
  } catch (error: any) {
    console.error("Newsletter unsubscribe error:", error);
    return res.status(500).json({ error: newsletterSchemaErrorMessage(error) });
  }
}
