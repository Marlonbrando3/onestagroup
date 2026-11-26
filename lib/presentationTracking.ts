import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { hasCookieYesConsent, subscribeToCookieYesConsent } from "@/lib/cookieConsent";

// Zapis aktywności klienta w prezentacji (otwarcie prezentacji / oferty) – WYŁĄCZNIE za zgodą:
// zgoda zapisana w CRM (czat / pasek zgody na prezentacji) albo zgoda „reklamowa” w CookieYes.
// Nie liczymy wejść osób zalogowanych (agent / CRM). Nic nie zapisujemy w pamięci przeglądarki –
// powroty w obrębie jednej wizyty odsiewamy w pamięci strony, a serwer dodatkowo blokuje duplikaty w 20 s.
const REPEAT_IN_PAGE_MS = 2 * 60 * 1000;
const trackedInThisVisit = new Map<string, number>();

function shouldTrackNow(key: string, oncePerVisit: boolean) {
  const last = trackedInThisVisit.get(key) || 0;
  const now = Date.now();
  if (last && (oncePerVisit || now - last < REPEAT_IN_PAGE_MS)) return false;
  trackedInThisVisit.set(key, now);
  return true;
}

// Zgoda „reklamowa” CookieYes w tej przeglądarce (z nasłuchiwaniem zmian w banerze)
export function useCookieYesAdvertisement() {
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    setAccepted(hasCookieYesConsent("advertisement"));
    return subscribeToCookieYesConsent((state) => setAccepted(state.accepted.includes("advertisement")));
  }, []);
  return accepted;
}

export function usePresentationTracking(
  token: string,
  type: "open" | "offer_view",
  offerId?: string,
  offerTitle?: string,
  options?: { isTemplate?: boolean; leadKey?: string; allowed?: boolean },
) {
  const isTemplate = Boolean(options?.isTemplate);
  const leadKey = options?.leadKey || "";
  const allowed = Boolean(options?.allowed);
  useEffect(() => {
    if (!token || !allowed) return;
    if (isTemplate && !leadKey) return;
    let cancelled = false;
    async function track() {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled || data.session) return;
        const key = `${type === "open" ? `${token}:open` : `${token}:offer:${offerId || ""}`}${leadKey ? `:${leadKey.slice(-12)}` : ""}`;
        if (!shouldTrackNow(key, type === "open")) return;
        await fetch("/api/presentation-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, type, offerId, offerTitle, k: leadKey || undefined }),
          keepalive: true,
        });
      } catch {
        // śledzenie nie może przeszkadzać klientowi w oglądaniu prezentacji
      }
    }
    track();
    return () => {
      cancelled = true;
    };
  }, [token, type, offerId, offerTitle, isTemplate, leadKey, allowed]);
}
