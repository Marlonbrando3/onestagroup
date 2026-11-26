import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { canAccessCrmContact, requireCrmUser } from "@/lib/crmServerAuth";
import { getConsentState, recordConsent, type ConsentKind } from "@/lib/consents";
import { getCrmUser } from "@/components/crm/users";

// Zgody klienta w karcie CRM: podgląd (z historią) i ręczne odnotowanie zmiany, np. gdy klient wycofa zgodę telefonicznie.
const KINDS: ConsentKind[] = ["sms", "phone", "email", "tracking"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const user = await requireCrmUser(req, res);
  if (!user || !supabaseServer) return;
  const contactId = String((req.method === "GET" ? req.query.contactId : req.body?.contactId) || "");
  if (!(await canAccessCrmContact(user, contactId))) return res.status(403).json({ error: "Brak dostępu do tego kontaktu." });

  if (req.method === "GET") {
    const [state, history] = await Promise.all([
      getConsentState(contactId),
      supabaseServer
        .from("crm_consents")
        .select("id,kind,granted,source,wording,recorded_by,created_at")
        .eq("crm_contact_id", contactId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    return res.status(200).json({ state, history: history.data || [] });
  }

  if (req.method === "POST") {
    const kind = String(req.body?.kind || "") as ConsentKind;
    if (!KINDS.includes(kind)) return res.status(400).json({ error: "Nieznany rodzaj zgody." });
    const granted = Boolean(req.body?.granted);
    const note = String(req.body?.note || "").trim().slice(0, 500);
    const author = getCrmUser(user.email)?.label || user.email;
    await recordConsent({
      contactId,
      kind,
      granted,
      source: "crm_manual",
      wording: note || (granted ? "Zgoda odnotowana ręcznie w CRM" : "Wycofanie zgody odnotowane ręcznie w CRM"),
      recordedBy: author,
    });
    return res.status(200).json({ state: await getConsentState(contactId) });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
