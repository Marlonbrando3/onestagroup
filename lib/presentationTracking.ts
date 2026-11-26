import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// Zapis aktywności klienta w prezentacji (otwarcie prezentacji / oferty).
// Nie liczymy wejść osób zalogowanych (agent lub CRM sprawdzający własną prezentację).
// Każde nowe otwarcie linku (nowa karta, ponowne wejście) liczy się osobno. W obrębie jednej karty
// pomijamy tylko powroty: ponowne „otwarcie prezentacji” po cofnięciu z oferty i tę samą ofertę w ciągu 2 minut.
const REPEAT_IN_TAB_MS = 2 * 60 * 1000;

function shouldTrackInThisTab(key: string, oncePerTab: boolean) {
  try {
    const storageKey = `onestaTrack:${key}`;
    const last = Number(window.sessionStorage.getItem(storageKey) || 0);
    const now = Date.now();
    if (last && (oncePerTab || now - last < REPEAT_IN_TAB_MS)) return false;
    window.sessionStorage.setItem(storageKey, String(now));
  } catch {
    // brak sessionStorage – liczymy zawsze
  }
  return true;
}
export function usePresentationTracking(
  token: string,
  type: "open" | "offer_view",
  offerId?: string,
  offerTitle?: string,
  // Wzorzec prezentacji: śledzimy tylko z kluczem leada z linku (?k=…); bez niego nic nie zapisujemy
  options?: { isTemplate?: boolean; leadKey?: string },
) {
  const isTemplate = Boolean(options?.isTemplate);
  const leadKey = options?.leadKey || "";
  useEffect(() => {
    if (!token) return;
    if (isTemplate && !leadKey) return;
    let cancelled = false;
    async function track() {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled || data.session) return;
        const key = `${type === "open" ? `${token}:open` : `${token}:offer:${offerId || ""}`}${leadKey ? `:${leadKey.slice(-12)}` : ""}`;
        if (!shouldTrackInThisTab(key, type === "open")) return;
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
  }, [token, type, offerId, offerTitle, isTemplate, leadKey]);
}
