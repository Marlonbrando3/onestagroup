import { isCrmAdmin, normalizeCrmEmail } from "@/components/crm/users";
import { supabaseServer } from "@/lib/supabaseClient";

// Powiązanie prezentacji z kontaktem (szansą sprzedaży) w CRM z poziomu strefy agenta.
// undefined = pole nie zostało wysłane (nie zmieniamy), null = odłącz, string = podłącz (po sprawdzeniu dostępu).
export async function resolveCrmContactLink(
  agentEmail: string,
  value: unknown,
): Promise<{ ok: true; contactId: string | null | undefined } | { ok: false; error: string }> {
  if (typeof value === "undefined") return { ok: true, contactId: undefined };
  const contactId = String(value || "").trim();
  if (!contactId) return { ok: true, contactId: null };
  if (!/^[0-9a-f-]{36}$/i.test(contactId) || !supabaseServer) {
    return { ok: false, error: "Nieprawidłowy klient w CRM" };
  }
  let query = supabaseServer.from("crm_contacts").select("id").eq("id", contactId);
  if (!isCrmAdmin(agentEmail)) query = query.eq("pipeline_owner", normalizeCrmEmail(agentEmail));
  const { data } = await query.maybeSingle();
  if (!data) return { ok: false, error: "Brak dostępu do wybranego klienta w CRM" };
  return { ok: true, contactId };
}
