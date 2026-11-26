import type { NextApiRequest, NextApiResponse } from "next";
import { recordLmTrackingEvent } from "@/lib/leadManager/tracking";
import { cookieYesAdvertisementFromRequest } from "@/lib/consents";

// Aktywność leada na /cbtop (wysyłana z lib/cbTopTracking.ts).
// Tokeny ze starych SMS-ów (sprzed przeniesienia, wydane przez leadmanager-iota.vercel.app) przekazujemy dalej
// do starej aplikacji, dopóki działa – wygasają po 90 dniach.
const LEGACY_ENDPOINT = "https://leadmanager-iota.vercel.app/api/tracking/event";
const ALLOWED_ORIGINS = new Set(["https://onesta.com.pl", "https://www.onesta.com.pl"]);

function isAllowedOrigin(origin?: string) {
  if (!origin) return true; // to samo źródło (przeglądarka nie zawsze wysyła Origin)
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin)) return res.status(403).json({ error: "Niedozwolone źródło żądania." });
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body: any = req.body;
  if (typeof body === "string") {
    if (body.length > 4096) return res.status(413).json({ error: "Żądanie jest zbyt duże." });
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Nieprawidłowe dane zdarzenia." });
    }
  }
  if (
    !body ||
    typeof body.token !== "string" ||
    body.token.length < 20 ||
    body.token.length > 2048 ||
    typeof body.event !== "string" ||
    (body.context !== undefined && typeof body.context !== "string") ||
    (body.offerId !== undefined && typeof body.offerId !== "string")
  ) {
    return res.status(400).json({ error: "Nieprawidłowe dane zdarzenia." });
  }

  try {
    const result = await recordLmTrackingEvent({ ...body, cookieConsent: cookieYesAdvertisementFromRequest(req) });
    if (result) return res.status(200).json({ ok: true, urgentContactStatus: result.urgentContactStatus });

    // Stary token → stara aplikacja
    const legacy = await fetch(LEGACY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8", Origin: "https://onesta.com.pl" },
      body: JSON.stringify({ token: body.token, event: body.event, context: body.context, offerId: body.offerId }),
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);
    if (legacy) {
      const data = await legacy.json().catch(() => ({}));
      return res.status(legacy.status).json(data);
    }
    return res.status(404).json({ error: "Token lub zdarzenie są nieprawidłowe." });
  } catch (error) {
    console.error("lead manager tracking:", error);
    return res.status(500).json({ error: "Nie udało się zapisać zdarzenia." });
  }
}
