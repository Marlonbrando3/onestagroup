import { supabaseServer } from "@/lib/supabaseClient";

// Okresy przechowywania (zgodnie z polityką prywatności, sekcja „Okres przechowywania danych”):
// - zapis aktywności w prezentacjach i na stronach z linków (oglądane oferty, kliknięcia) – 24 miesiące,
// - dziennik techniczny Lead Managera – 12 miesięcy.
// Dane kontaktowe, notatki i zgody w CRM nie są tu usuwane (usuwa je obsługa przy żądaniu klienta / usunięciu kontaktu).
export const TRACKING_RETENTION_MONTHS = 24;
export const LOG_RETENTION_MONTHS = 12;

function monthsAgo(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString();
}

export async function runDataRetention() {
  if (!supabaseServer) return { ok: false };
  const trackingCutoff = monthsAgo(TRACKING_RETENTION_MONTHS);
  const logCutoff = monthsAgo(LOG_RETENTION_MONTHS);
  const results = await Promise.all([
    supabaseServer.from("presentation_events").delete({ count: "exact" }).lt("created_at", trackingCutoff),
    supabaseServer.from("lm_tracking_events").delete({ count: "exact" }).lt("created_at", trackingCutoff),
    supabaseServer.from("lm_log").delete({ count: "exact" }).lt("created_at", logCutoff),
  ]);
  return {
    ok: results.every((result) => !result.error),
    presentationEvents: results[0].count || 0,
    lmTrackingEvents: results[1].count || 0,
    lmLog: results[2].count || 0,
  };
}
