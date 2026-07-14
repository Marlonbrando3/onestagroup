import type { NextApiRequest, NextApiResponse } from "next";
import {
  createNewsletterEvidencePackage,
  verifyNewsletterEvidencePayload,
  verifyNewsletterEvidenceSignature,
} from "@/lib/newsletterDoubleOptIn";
import { handleMailingDatabaseError, requireCrmAdmin } from "@/lib/crmMailingServer";
import { supabaseServer } from "@/lib/supabaseClient";

function safeFilename(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9@._-]+/g, "-").slice(0, 120);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireCrmAdmin(req, res);
  if (!admin || !supabaseServer) return;
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const contactId = String(req.query.contactId || "").trim();
  if (!contactId) return res.status(400).json({ error: "Brak ID kontaktu." });

  try {
    const { data: contact, error: contactError } = await supabaseServer
      .from("crm_contacts")
      .select("id,name,email,marketing_email_status,marketing_consent_at,marketing_consent_source,marketing_unsubscribed_at,marketing_consent_evidence_id")
      .eq("id", contactId)
      .single();
    if (contactError) return handleMailingDatabaseError(res, contactError);
    const email = String(contact.email || "").trim().toLowerCase();
    if (!email) return res.status(404).json({ error: "Kontakt nie ma adresu e-mail." });

    const { data: subscription, error: subscriptionError } = await supabaseServer
      .from("newsletter_subscriptions")
      .select("*")
      .eq("email_normalized", email)
      .maybeSingle();
    if (subscriptionError) throw subscriptionError;
    if (!subscription) return res.status(404).json({ error: "Brak rejestru double opt-in dla tego adresu." });

    let { data: packages, error: packagesError } = await supabaseServer
      .from("newsletter_evidence_packages")
      .select("*")
      .eq("subscription_id", subscription.id)
      .order("created_at", { ascending: true });
    if (packagesError) throw packagesError;

    if (subscription.status === "confirmed" && !(packages || []).some((item) => item.package_type === "consent_confirmed")) {
      const evidence = await createNewsletterEvidencePackage(subscription.id, "consent_confirmed");
      await supabaseServer
        .from("crm_contacts")
        .update({ marketing_consent_evidence_id: evidence.id })
        .eq("id", contact.id);
      const refreshed = await supabaseServer
        .from("newsletter_evidence_packages")
        .select("*")
        .eq("subscription_id", subscription.id)
        .order("created_at", { ascending: true });
      if (refreshed.error) throw refreshed.error;
      packages = refreshed.data;
    }

    const { data: events, error: eventsError } = await supabaseServer
      .from("newsletter_consent_events")
      .select("*")
      .eq("subscription_id", subscription.id)
      .order("occurred_at", { ascending: true });
    if (eventsError) throw eventsError;

    const verifiedPackages = (packages || []).map((item) => {
      const contentVerified = verifyNewsletterEvidencePayload(item.canonical_payload, item.payload_hash);
      const signatureVerified = verifyNewsletterEvidenceSignature(item.payload_hash, item.payload_signature);
      return {
        ...item,
        integrity_verified: contentVerified && signatureVerified,
        content_hash_verified: contentVerified,
        server_signature_verified: signatureVerified,
      };
    });
    const allVerified = verifiedPackages.length > 0 && verifiedPackages.every((item) => item.integrity_verified);
    const exportedAt = new Date().toISOString();
    const document = {
      export_schema: "onesta-consent-evidence-export-v1",
      exported_at: exportedAt,
      exported_by: admin.email,
      integrity: {
        algorithm: "SHA-256 over canonical JSON plus HMAC-SHA-256 server signature",
        all_packages_verified: allVerified,
      },
      contact,
      subscription,
      evidence_packages: verifiedPackages,
      consent_events: events || [],
    };

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="dowod-zgody-${safeFilename(email)}-${exportedAt.slice(0, 10)}.json"`,
    );
    return res.status(200).send(JSON.stringify(document, null, 2));
  } catch (error: any) {
    return handleMailingDatabaseError(res, error);
  }
}
