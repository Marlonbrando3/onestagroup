import type { NextApiRequest, NextApiResponse } from "next";
import { resolvePublicOfferListToken } from "@/lib/publicOfferListToken";
import { supabaseServer } from "@/lib/supabaseClient";
import { resolveLeadKey } from "@/lib/leadManager/tracking";
import { recordConsent, TRACKING_CONSENT_WORDING } from "@/lib/consents";

// Pasek zgody na stronie prezentacji: klient sam udziela / odmawia / wycofuje zgody na zapisywanie oglądanych ofert.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false });
  }
  if (!supabaseServer) return res.status(500).json({ success: false });
  const token = await resolvePublicOfferListToken(req.body?.token);
  if (!token) return res.status(400).json({ success: false });
  const { data: list } = await supabaseServer
    .from("agent_offer_lists")
    .select("id,is_template,crm_contact_id")
    .eq("public_token", token)
    .maybeSingle();
  if (!list) return res.status(404).json({ success: false });

  const lead = list.is_template ? await resolveLeadKey(req.body?.k) : null;
  const contactId = list.is_template ? lead?.contactId : list.crm_contact_id;
  if (!contactId) return res.status(200).json({ success: false, reason: "no-contact" });

  const granted = Boolean(req.body?.granted);
  await recordConsent({
    contactId,
    leadId: lead?.leadId || null,
    kind: "tracking",
    granted,
    source: "presentation",
    wording: granted ? TRACKING_CONSENT_WORDING : String(req.body?.withdraw ? "Wycofanie zgody na stronie prezentacji" : "Odmowa na stronie prezentacji"),
  });
  return res.status(200).json({ success: true, granted });
}
