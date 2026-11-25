import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// Zapis aktywności klienta w prezentacji (otwarcie prezentacji / oferty).
// Nie liczymy wejść osób zalogowanych (agent lub CRM sprawdzający własną prezentację).
export function usePresentationTracking(
  token: string,
  type: "open" | "offer_view",
  offerId?: string,
  offerTitle?: string,
) {
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    async function track() {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled || data.session) return;
        await fetch("/api/presentation-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, type, offerId, offerTitle }),
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
  }, [token, type, offerId, offerTitle]);
}
