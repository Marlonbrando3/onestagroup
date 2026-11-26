import type { IncomingMessage } from "http";
import { supabaseServer } from "@/lib/supabaseClient";

// Rejestr zgód klienta (tabela crm_consents): każda zmiana to nowy wpis – dowód, kiedy, skąd i na jaką treść.
// Aktualny stan = ostatni wpis danego rodzaju.

export type ConsentKind = "sms" | "phone" | "email" | "tracking";
export type ConsentSource = "meta_form" | "chat" | "presentation" | "crm_manual" | "diagnostic";
export type ConsentEntry = { granted: boolean; at: string; source: ConsentSource; wording: string | null; recordedBy: string | null };
export type ConsentState = Partial<Record<ConsentKind, ConsentEntry>>;

// Treści zgód pokazywane klientowi – zapisywane razem ze zgodą
export const TRACKING_CONSENT_WORDING =
  "Zgadzam się, aby Onesta Group zapisywała, które z przesłanych mi ofert oglądam i które oznaczam, w celu dopasowania propozycji przez doradcę. Zgodę mogę wycofać w każdej chwili.";

export async function recordConsent(input: {
  contactId: string;
  kind: ConsentKind;
  granted: boolean;
  source: ConsentSource;
  wording?: string | null;
  leadId?: string | null;
  recordedBy?: string | null;
}) {
  if (!supabaseServer) return;
  const { error } = await supabaseServer.from("crm_consents").insert({
    crm_contact_id: input.contactId,
    kind: input.kind,
    granted: input.granted,
    source: input.source,
    wording: input.wording ? input.wording.slice(0, 1000) : null,
    lead_id: input.leadId || null,
    recorded_by: input.recordedBy || null,
  });
  if (error) console.error("consents: zapis", error);
}

export async function getConsentState(contactId: string): Promise<ConsentState> {
  if (!supabaseServer || !contactId) return {};
  const { data } = await supabaseServer
    .from("crm_consents")
    .select("kind,granted,source,wording,recorded_by,created_at")
    .eq("crm_contact_id", contactId)
    .order("created_at", { ascending: false })
    .limit(100);
  const state: ConsentState = {};
  for (const row of data || []) {
    const kind = row.kind as ConsentKind;
    if (state[kind]) continue;
    state[kind] = {
      granted: Boolean(row.granted),
      at: row.created_at,
      source: row.source as ConsentSource,
      wording: row.wording || null,
      recordedBy: row.recorded_by || null,
    };
  }
  return state;
}

export async function hasTrackingConsent(contactId?: string | null) {
  if (!contactId) return false;
  const state = await getConsentState(contactId);
  return Boolean(state.tracking?.granted);
}

// Zgoda „reklamowa” z banera CookieYes w tej przeglądarce (ciasteczko cookieyes-consent w żądaniu)
export function cookieYesAdvertisementFromRequest(req: IncomingMessage) {
  const header = String(req.headers.cookie || "");
  const raw = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("cookieyes-consent="));
  if (!raw) return false;
  let value = raw.slice("cookieyes-consent=".length);
  try {
    value = decodeURIComponent(value);
  } catch {
    // zostawiamy surową wartość
  }
  return value.split(",").some((item) => item.trim() === "advertisement:yes");
}
